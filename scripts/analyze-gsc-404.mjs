import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://gray-alligator-918491.hostingersite.com/api/v1').replace(/\/+$/, '');
const inputPath = process.argv[2];
const outputPath = process.argv[3] || path.join('tmp', 'gsc-404-classified.csv');

if (!inputPath) {
  console.error('Usage: node scripts/analyze-gsc-404.mjs <GSC Table.csv> [output.csv]');
  process.exit(1);
}

const spamMarkers = [
  'aave', 'bitcoin', 'blockchain', 'ethereum', 'monero', 'polkadot', 'solana',
  'tokenomics', 'vechain', 'wallet', 'whitepaper',
];
const obsoletePaths = new Set([
  'blogs_paginate', 'colleges_paginate', 'comments', 'country_colleges_paginate',
  'country_paginate', 'documentation', 'guardians', 'packages',
  'predictor-colleges', 'tutorials', 'videos',
]);
const stopWords = new Set([
  'and', 'at', 'college', 'faculty', 'for', 'hospital', 'in', 'institute',
  'institution', 'mbbs', 'medical', 'medicine', 'of', 'research', 'school',
  'science', 'sciences', 'the', 'university',
]);

function parseCsv(text) {
  const records = [];
  let record = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      record.push(current);
      current = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      record.push(current);
      if (record.some(Boolean)) records.push(record);
      record = [];
      current = '';
    } else {
      current += character;
    }
  }

  record.push(current);
  if (record.some(Boolean)) records.push(record);
  return records;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function tokens(value) {
  return new Set(
    value.toLowerCase().replaceAll(/[^a-z0-9]+/g, ' ').trim().split(/\s+/)
      .filter((token) => token.length > 2 && !stopWords.has(token)),
  );
}

function similarity(left, right) {
  const leftTokens = tokens(left);
  const rightTokens = tokens(right);
  if (!leftTokens.size || !rightTokens.size) return 0;
  const common = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return (2 * common) / (leftTokens.size + rightTokens.size);
}

async function fetchCollection(resource, limit) {
  const response = await fetch(`${API_BASE_URL}/${resource}?limit=${limit}`);
  if (!response.ok) throw new Error(`${resource} API returned ${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload) ? payload : payload.data || [];
}

function bestUniversityMatch(slug, universities) {
  let best = { score: 0, slug: '' };
  for (const university of universities) {
    const score = similarity(slug, `${university.slug || ''} ${university.name || ''}`);
    if (score > best.score) best = { score, slug: university.slug || '' };
  }
  return best;
}

const [rawCsv, universities, blogs, countries] = await Promise.all([
  readFile(inputPath, 'utf8'),
  fetchCollection('universities', 1000),
  fetchCollection('blogs', 500),
  fetchCollection('countries', 500),
]);

const universitySlugs = new Set(universities.map((item) => item.slug?.toLowerCase()).filter(Boolean));
const blogSlugs = new Set(blogs.map((item) => item.slug?.toLowerCase()).filter(Boolean));
const countrySlugs = new Set(countries.map((item) => item.slug?.toLowerCase()).filter(Boolean));
const rows = parseCsv(rawCsv).slice(1).map(([url, lastCrawled]) => {
  const parsed = new URL(url.replaceAll(/\s+/g, ''));
  let decodedPath = parsed.pathname;
  try {
    decodedPath = decodeURIComponent(parsed.pathname);
  } catch {
    // Keep malformed encoded paths unchanged so they can be classified as spam.
  }
  const cleanPath = decodedPath.replace(/\/+$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);
  const route = parts[0]?.toLowerCase() || '';
  const slug = parts.at(-1)?.toLowerCase() || '';
  const lowerPath = cleanPath.toLowerCase();
  const exactUniversity = universitySlugs.has(slug);
  let category = 'unknown-stale-url';
  let action = 'Keep a real 404 unless a verified replacement exists';
  let destination = '';

  if (obsoletePaths.has(route) || route === 'public' || /^\/\d+\.shtml$/.test(lowerPath)
    || lowerPath.includes('<link') || spamMarkers.some((marker) => lowerPath.includes(marker))) {
    category = 'spam-or-obsolete';
    action = 'Return 410 Gone';
  } else if (route === 'colleges' && exactUniversity) {
    category = 'redirect-worthy';
    action = 'Permanent redirect';
    destination = `/college/${slug}`;
  } else if ((route === 'college' || route === 'universities') && exactUniversity) {
    category = route === 'college' ? 'already-valid-stale-gsc' : 'redirect-worthy';
    action = route === 'college' ? 'No code change; request GSC validation' : 'Permanent redirect';
    destination = route === 'universities' ? `/college/${slug}` : '';
  } else if (route === 'country-colleges') {
    category = 'redirect-worthy';
    action = 'Permanent redirect';
    destination = `/college?country=${encodeURIComponent(parts[1] || '')}`;
  } else if (['countiries', 'countires', 'coutnries'].includes(route)) {
    category = 'redirect-worthy';
    action = 'Permanent redirect';
    destination = `/countries/${parts.slice(1).join('/')}`;
  } else if (route === 'index.php') {
    category = 'redirect-worthy';
    action = 'Remove /index.php prefix with permanent redirect';
    destination = `/${parts.slice(1).join('/')}`;
  } else if (parts.length === 1 && universitySlugs.has(slug)) {
    category = 'redirect-worthy';
    action = 'Permanent redirect after API existence check';
    destination = `/college/${slug}`;
  } else if (parts.length === 1 && blogSlugs.has(slug)) {
    category = 'redirect-worthy';
    action = 'Permanent redirect after API existence check';
    destination = `/blogs/${slug}`;
  } else if (route === 'countries' && countrySlugs.has(slug)) {
    category = 'already-valid-stale-gsc';
    action = 'No code change; request GSC validation';
  } else if (['college', 'colleges', 'universities'].includes(route) || parts.length === 1) {
    const match = bestUniversityMatch(slug, universities);
    if (match.score >= 0.88) {
      category = 'manual-redirect-candidate';
      action = 'Review before redirecting';
      destination = `/college/${match.slug}`;
    } else {
      category = 'deleted-or-unknown-content';
      action = 'Keep 404; use 410 only after confirming permanent removal';
    }
  }

  return { url, lastCrawled, category, action, destination };
});

const summary = Object.entries(Object.groupBy(rows, (row) => row.category))
  .map(([category, items]) => ({ category, count: items.length }))
  .sort((left, right) => right.count - left.count);
const header = ['URL', 'Last crawled', 'Category', 'Action', 'Destination'];
const report = [
  header.join(','),
  ...rows.map((row) => [row.url, row.lastCrawled, row.category, row.action, row.destination].map(csvCell).join(',')),
].join('\n');

await writeFile(outputPath, report, 'utf8');
console.table(summary);
console.log(`Classified ${rows.length} URLs against ${universities.length} universities, ${blogs.length} blogs, and ${countries.length} countries.`);
console.log(`Report: ${path.resolve(outputPath)}`);
