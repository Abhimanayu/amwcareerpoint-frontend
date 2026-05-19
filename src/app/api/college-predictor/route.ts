import { NextRequest, NextResponse } from 'next/server';
import cutoffData from '@/lib/data/neet-cutoff.json';
import { deriveCategoryParts } from '@/lib/collegePredictorCategory';

interface CutoffEntry {
  state: string;
  college: string;
  category: string;
  closingRank: number;
  quota: string;
}

interface DerivedStateMeta {
  categories: string[];
  quotas: string[];
  subCategoriesByCategory: Record<string, string[]>;
}

function normalizeQuota(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

function formatQuotaLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

const data = cutoffData as CutoffEntry[];

// ── Pre-compute derived meta at module load (runs once per server instance) ──
const derivedStateMeta: Record<string, DerivedStateMeta> = {};

for (const entry of data) {
  const { state: entryState, category: rawCat, quota } = entry;
  if (!derivedStateMeta[entryState]) {
    derivedStateMeta[entryState] = { categories: [], quotas: [], subCategoriesByCategory: {} };
  }
  const meta = derivedStateMeta[entryState];
  const { category: dCat, subCategory: dSub } = deriveCategoryParts(entryState, rawCat);
  const normalizedQuota = normalizeQuota(quota);
  const quotaLabel = formatQuotaLabel(quota);

  if (!meta.categories.includes(dCat)) meta.categories.push(dCat);
  if (!meta.quotas.some(existing => normalizeQuota(existing) === normalizedQuota)) {
    meta.quotas.push(quotaLabel);
  }

  if (!meta.subCategoriesByCategory[dCat]) {
    meta.subCategoriesByCategory[dCat] = [];
  }
  if (dSub && !meta.subCategoriesByCategory[dCat].includes(dSub)) {
    meta.subCategoriesByCategory[dCat].push(dSub);
  }
}

// Sort all arrays for stable UI ordering
for (const meta of Object.values(derivedStateMeta)) {
  meta.categories.sort();
  meta.quotas.sort();
  for (const subs of Object.values(meta.subCategoriesByCategory)) {
    subs.sort();
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Metadata endpoint: returns per-state derived categories, quotas & subCategoriesByCategory
  if (searchParams.get('meta') === '1') {
    return NextResponse.json(
      { stateMeta: derivedStateMeta },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  }

  const rankStr = searchParams.get('rank');
  const state = searchParams.get('state')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const subCategory = searchParams.get('subCategory')?.trim() || '';
  const quota = searchParams.get('quota')?.trim() || '';
  const normalizedQuotaFilter = quota ? normalizeQuota(quota) : '';

  const rank = parseInt(rankStr || '0');
  if (!rank || rank <= 0 || rank > 2000000) {
    return NextResponse.json(
      { error: 'Invalid rank. Enter a rank between 1 and 20,00,000.' },
      { status: 400 },
    );
  }

  const matches = data.filter(entry => {
    if (rank > entry.closingRank) return false;
    if (state && entry.state !== state) return false;
    if (normalizedQuotaFilter && normalizeQuota(entry.quota) !== normalizedQuotaFilter) return false;

    if (category || subCategory) {
      const { category: dCat, subCategory: dSub } = deriveCategoryParts(entry.state, entry.category);
      if (category && dCat.toUpperCase() !== category.toUpperCase()) return false;
      if (subCategory && (dSub ?? '').toUpperCase() !== subCategory.toUpperCase()) return false;
    }

    return true;
  });

  matches.sort((a, b) => a.closingRank - b.closingRank);

  const results = matches.map(entry => {
    const { category: dCat, subCategory: dSub } = deriveCategoryParts(entry.state, entry.category);
    return {
      state: entry.state,
      college: entry.college,
      rawCategory: entry.category,
      category: dCat,
      subCategory: dSub,
      closingRank: entry.closingRank,
      quota: entry.quota,
    };
  });

  return NextResponse.json(
    {
      rank,
      state: state || 'All States',
      category: category || 'All',
      subCategory: subCategory || null,
      quota: quota || 'All',
      totalMatches: results.length,
      results,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
