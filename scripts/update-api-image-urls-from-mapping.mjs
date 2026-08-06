import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

readEnvFile('.env.local');
readEnvFile('.env.imagekit.local', { override: true });

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://gray-alligator-918491.hostingersite.com/api/v1').replace(/\/$/, '');
const token = process.env.AMW_ADMIN_TOKEN;
const mappingPath = process.argv[2] || join('tmp', 'imagekit-url-mapping.json');
const shouldApply = process.argv.includes('--apply');
const reportPath = join('tmp', shouldApply ? 'imagekit-db-update-report.json' : 'imagekit-db-update-dry-run.json');

if (!existsSync(mappingPath)) {
  console.error(`Mapping not found: ${mappingPath}`);
  process.exit(1);
}

if (shouldApply && !token) {
  console.error('Missing AMW_ADMIN_TOKEN in .env.imagekit.local. Refusing to update API without auth token.');
  process.exit(1);
}

const mapping = JSON.parse(readFileSync(mappingPath, 'utf8'));

const resources = [
  { key: 'countries', list: '/countries?limit=1000&status=all', update: (id) => `/countries/${id}` },
  { key: 'universities', list: '/universities?limit=1000&status=all', update: (id) => `/universities/${id}` },
  { key: 'blogs', list: '/blogs?limit=1000&status=all', update: (id) => `/blogs/${id}` },
];

function extractItems(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload?.[key])) return payload[key];
  return [];
}

function rewriteValue(value, stats) {
  if (typeof value === 'string') {
    if (mapping[value]) {
      stats.replaced += 1;
      return mapping[value];
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => rewriteValue(item, stats));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteValue(item, stats)])
    );
  }
  return value;
}

function stripReadOnlyFields(item) {
  const clone = structuredClone(item);
  delete clone._id;
  delete clone.id;
  delete clone.createdAt;
  delete clone.updatedAt;
  delete clone.__v;
  return clone;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(path, init = {}, attempt = 1) {
  const res = await fetch(`${API}${path}`, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (res.status === 429 && attempt <= 8) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : Math.min(30_000, 1500 * attempt);
    await wait(delay);
    return requestJson(path, init, attempt + 1);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${path}: ${typeof json === 'string' ? json.slice(0, 300) : JSON.stringify(json).slice(0, 300)}`);
  }
  return json;
}

const report = [];

for (const resource of resources) {
  const payload = await requestJson(resource.list);
  const items = extractItems(payload, resource.key);

  for (const item of items) {
    const id = item._id || item.id;
    if (!id) continue;

    const stats = { replaced: 0 };
    const rewritten = rewriteValue(item, stats);
    if (stats.replaced === 0) continue;

    const entry = {
      resource: resource.key,
      id,
      slug: item.slug || '',
      name: item.name || item.title || '',
      replaced: stats.replaced,
      applied: false,
    };

    if (shouldApply) {
      await requestJson(resource.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(stripReadOnlyFields(rewritten)),
      });
      await wait(250);
      entry.applied = true;
    }

    report.push(entry);
  }
}

writeFileSync(reportPath, JSON.stringify({
  api: API,
  mappingPath,
  mode: shouldApply ? 'apply' : 'dry-run',
  totalItems: report.length,
  totalReplacements: report.reduce((sum, item) => sum + item.replaced, 0),
  items: report,
}, null, 2));

console.log(JSON.stringify({
  mode: shouldApply ? 'apply' : 'dry-run',
  totalItems: report.length,
  totalReplacements: report.reduce((sum, item) => sum + item.replaced, 0),
  reportPath,
}, null, 2));
