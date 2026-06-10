type CacheEntry<T> = {
  payload: T;
  timestamp: number;
};

const DEFAULT_SERVER_CACHE_TTL_MS = 60_000;
const MAX_SERVER_CACHE_ENTRIES = 200;

const serverCache = new Map<string, CacheEntry<unknown>>();
const serverInflight = new Map<string, Promise<unknown>>();

function isBrowser() {
  return "window" in globalThis;
}

function pruneServerCache() {
  if (serverCache.size <= MAX_SERVER_CACHE_ENTRIES) {
    return;
  }

  const oldestKeys = [...serverCache.entries()]
    .sort(([, left], [, right]) => left.timestamp - right.timestamp)
    .slice(0, serverCache.size - MAX_SERVER_CACHE_ENTRIES)
    .map(([key]) => key);

  for (const key of oldestKeys) {
    serverCache.delete(key);
  }
}

export function normalizeCacheParams(params: Record<string, unknown>) {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right));

  return JSON.stringify(entries);
}

export async function getServerCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_SERVER_CACHE_TTL_MS
) {
  if (isBrowser()) {
    return fetcher();
  }

  const cached = serverCache.get(key) as CacheEntry<T> | undefined;
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.payload;
  }

  const inflight = serverInflight.get(key) as Promise<T> | undefined;
  if (inflight) {
    return inflight;
  }

  const request = fetcher();
  serverInflight.set(key, request);

  try {
    const payload = await request;
    serverCache.set(key, { payload, timestamp: Date.now() });
    pruneServerCache();
    return payload;
  } finally {
    if (serverInflight.get(key) === request) {
      serverInflight.delete(key);
    }
  }
}

export function invalidateServerCacheByPrefix(prefixes: string[]) {
  if (!prefixes.length) {
    return;
  }

  for (const key of serverCache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      serverCache.delete(key);
    }
  }

  for (const key of serverInflight.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      serverInflight.delete(key);
    }
  }
}
