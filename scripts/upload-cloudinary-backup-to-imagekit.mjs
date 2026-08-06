import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url)).replace(/\\scripts$/, '');

function readEnvFile(filePath, options = {}) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) continue;
    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && (options.override || process.env[key] == null)) process.env[key] = value;
  }
}

readEnvFile(join(rootDir, '.env.local'));
readEnvFile(join(rootDir, '.env.imagekit.local'), { override: true });

const backupDir = process.argv[2] || join(rootDir, 'cloudinary-backup', '20260806-094844');
const manifestPath = join(backupDir, 'manifest.json');
const outputDir = join(rootDir, 'tmp');
const outputPath = process.argv[3] || join(outputDir, 'imagekit-url-mapping.json');
const failurePath = outputPath.replace(/\.json$/i, '.failures.json');

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '').replace(/\/$/, '');
const folderPrefix = (process.env.IMAGEKIT_FOLDER || '/amw').replace(/\/$/, '');

if (!privateKey || !urlEndpoint) {
  console.error('Missing ImageKit config. Add these to .env.imagekit.local:');
  console.error('IMAGEKIT_PRIVATE_KEY=private_xxx');
  console.error('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id');
  console.error('IMAGEKIT_FOLDER=/amw');
  process.exit(1);
}

if (!existsSync(manifestPath)) {
  console.error(`Backup manifest not found: ${manifestPath}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const previousMapping = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf8')) : {};
const previousFailures = existsSync(failurePath) ? JSON.parse(readFileSync(failurePath, 'utf8')) : [];
const mapping = { ...previousMapping };
const failures = [];
const assets = manifest.assets || [];
const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`;

function imageKitFolderForAsset(assetRelativePath) {
  const localRelative = relative(join(backupDir, 'assets'), join(backupDir, assetRelativePath));
  const parts = localRelative.split(sep);
  const folderParts = parts.slice(0, -1);
  return [folderPrefix, ...folderParts].join('/').replace(/\/+/g, '/');
}

function fileNameForAsset(assetRelativePath) {
  const localRelative = relative(join(backupDir, 'assets'), join(backupDir, assetRelativePath));
  return localRelative.split(sep).pop();
}

async function uploadAsset(asset, index) {
  if (mapping[asset.url]) return;

  const filePath = join(backupDir, asset.relativePath);
  const fileBuffer = readFileSync(filePath);
  const fileBlob = new Blob([fileBuffer], { type: asset.contentType || 'application/octet-stream' });
  const form = new FormData();
  form.append('file', fileBlob, fileNameForAsset(asset.relativePath));
  form.append('fileName', fileNameForAsset(asset.relativePath));
  form.append('folder', imageKitFolderForAsset(asset.relativePath));
  form.append('useUniqueFileName', 'false');
  form.append('overwriteFile', 'true');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: authHeader },
    body: form,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`ImageKit upload failed ${res.status}: ${text.slice(0, 400)}`);
  }

  const payload = JSON.parse(text);
  mapping[asset.url] = payload.url || `${urlEndpoint}${payload.filePath}`;
  if ((index + 1) % 50 === 0) {
    writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
    console.log(`uploaded ${index + 1}/${assets.length}`);
  }
}

for (let index = 0; index < assets.length; index += 1) {
  const asset = assets[index];
  try {
    await uploadAsset(asset, index);
  } catch (error) {
    failures.push({ url: asset.url, relativePath: asset.relativePath, error: error.message });
    console.error(`failed ${index + 1}/${assets.length}: ${asset.url}`);
  }
}

writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
writeFileSync(failurePath, JSON.stringify([...previousFailures, ...failures], null, 2));

console.log(JSON.stringify({
  total: assets.length,
  mapped: Object.keys(mapping).length,
  failed: failures.length,
  outputPath,
  failurePath,
}, null, 2));
