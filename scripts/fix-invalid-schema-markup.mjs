const API = process.env.NEXT_PUBLIC_API_URL || 'https://gray-alligator-918491.hostingersite.com/api/v1';
const ADMIN_TOKEN = process.env.AMW_ADMIN_TOKEN || '';
const APPLY = process.argv.includes('--apply');

const endpoints = [
  {
    type: 'country',
    list: '/countries?limit=500',
    key: 'countries',
    detail: (slug) => `/countries/${slug}`,
    update: (id) => `/countries/${id}`,
  },
  {
    type: 'blog',
    list: '/blogs?limit=500',
    key: 'blogs',
    detail: (slug) => `/blogs/${slug}`,
    update: (id) => `/blogs/${id}`,
  },
];

function extractArray(payload, key) {
  const queue = [payload];
  const seen = new Set();

  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    if (Array.isArray(current)) return current;
    if (typeof current !== 'object') continue;

    seen.add(current);
    if (Array.isArray(current[key])) return current[key];
    if (Array.isArray(current.items)) return current.items;
    if (Array.isArray(current.results)) return current.results;
    if (current.data) queue.push(current.data);

    for (const value of Object.values(current)) {
      if (value && typeof value === 'object') queue.push(value);
    }
  }

  return [];
}

async function get(path) {
  const response = await fetch(`${API}${path}`);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 160)}`);
  }

  return text ? JSON.parse(text) : null;
}

async function put(path, payload) {
  if (!ADMIN_TOKEN) {
    throw new Error('AMW_ADMIN_TOKEN is required when running with --apply');
  }

  const response = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`);
  }

  return text ? JSON.parse(text) : null;
}

function pickRecord(payload) {
  return payload?.data && !Array.isArray(payload.data) ? payload.data : payload;
}

function extractJsonCandidates(raw) {
  const value = String(raw || '').trim();
  const candidates = [];

  for (const match of value.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    candidates.push(match[1].trim());
  }

  if (candidates.length === 0) candidates.push(value);
  return candidates;
}

function normalizeSchema(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    return { action: 'empty', value: '' };
  }

  try {
    JSON.parse(raw);
    return { action: 'already-valid', value: raw.trim() };
  } catch {
    // Continue to extraction.
  }

  const parsed = [];
  for (const candidate of extractJsonCandidates(raw)) {
    try {
      parsed.push(JSON.parse(candidate));
    } catch {
      // Ignore malformed script blocks.
    }
  }

  if (parsed.length === 1) {
    return { action: 'extract-json', value: JSON.stringify(parsed[0], null, 2) };
  }

  if (parsed.length > 1) {
    return {
      action: 'combine-graph',
      value: JSON.stringify({ '@context': 'https://schema.org', '@graph': parsed }, null, 2),
    };
  }

  return { action: 'clear', value: '' };
}

function buildUpdatePayload(detail, schemaMarkup) {
  return {
    seo: {
      ...(detail.seo || {}),
      schemaMarkup,
    },
  };
}

const report = {
  mode: APPLY ? 'apply' : 'dry-run',
  api: API,
  generatedAt: new Date().toISOString(),
  changed: [],
  skipped: [],
  errors: [],
};

for (const cfg of endpoints) {
  try {
    const listPayload = await get(cfg.list);
    const rows = extractArray(listPayload, cfg.key);
    const seen = new Set();

    for (const row of rows) {
      const slug = row?.slug;
      const id = row?._id || row?.id;
      if (!slug || !id || seen.has(slug)) continue;
      seen.add(slug);

      try {
        const detail = pickRecord(await get(cfg.detail(slug)));
        const schemaMarkup = detail?.seo?.schemaMarkup;
        const normalized = normalizeSchema(schemaMarkup);
        const name = row?.name || row?.title || slug;

        if (!['extract-json', 'combine-graph', 'clear'].includes(normalized.action)) {
          report.skipped.push({ type: cfg.type, name, slug, id, action: normalized.action });
          continue;
        }

        const item = {
          type: cfg.type,
          name,
          slug,
          id,
          action: normalized.action,
          oldLength: typeof schemaMarkup === 'string' ? schemaMarkup.length : 0,
          newLength: normalized.value.length,
        };

        if (APPLY) {
          await put(cfg.update(id), buildUpdatePayload(detail, normalized.value));
        }

        report.changed.push(item);
      } catch (error) {
        report.errors.push({
          type: cfg.type,
          slug,
          id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  } catch (error) {
    report.errors.push({
      type: cfg.type,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

console.log(JSON.stringify(report, null, 2));

if (APPLY && report.errors.length > 0) {
  process.exitCode = 1;
}
