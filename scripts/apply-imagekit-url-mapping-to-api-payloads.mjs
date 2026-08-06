import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const API = (process.env.NEXT_PUBLIC_API_URL || 'https://gray-alligator-918491.hostingersite.com/api/v1').replace(/\/$/, '');
const mappingPath = process.argv[2] || join('tmp', 'imagekit-url-mapping.json');
const outputDir = process.argv[3] || join('tmp', 'imagekit-rewritten-payloads');

if (!existsSync(mappingPath)) {
  console.error(`Mapping not found: ${mappingPath}`);
  process.exit(1);
}

const mapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
mkdirSync(outputDir, { recursive: true });

const endpoints = [
  ['countries', '/countries?limit=1000&status=all'],
  ['universities', '/universities?limit=1000&status=all'],
  ['blogs', '/blogs?limit=1000&status=all'],
];

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

function extractItems(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload?.[key])) return payload[key];
  return [];
}

const summary = [];

for (const [key, endpoint] of endpoints) {
  const res = await fetch(`${API}${endpoint}`);
  const payload = await res.json();
  const items = extractItems(payload, key);
  const stats = { replaced: 0 };
  const rewritten = items.map((item) => rewriteValue(item, stats));
  const filePath = join(outputDir, `${key}.json`);
  writeFileSync(filePath, JSON.stringify(rewritten, null, 2));
  summary.push({ key, count: rewritten.length, replaced: stats.replaced, filePath });
}

writeFileSync(join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
