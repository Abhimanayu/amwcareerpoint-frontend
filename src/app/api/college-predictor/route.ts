import { NextRequest, NextResponse } from 'next/server';
import cutoffData from '@/lib/data/neet-cutoff.json';
import stateMeta from '@/lib/data/neet-state-meta.json';

interface CutoffEntry {
  state: string;
  college: string;
  category: string;
  closingRank: number;
  quota: string;
}

const data = cutoffData as CutoffEntry[];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rankStr = searchParams.get('rank');
  const state = searchParams.get('state')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const quota = searchParams.get('quota')?.trim() || '';

  // Metadata endpoint: returns per-state categories & quotas
  if (searchParams.get('meta') === '1') {
    return NextResponse.json({ stateMeta }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  }

  const rank = parseInt(rankStr || '0');
  if (!rank || rank <= 0 || rank > 2000000) {
    return NextResponse.json({ error: 'Invalid rank. Enter a rank between 1 and 20,00,000.' }, { status: 400 });
  }

  const matches = data.filter(entry => {
    if (rank > entry.closingRank) return false;
    if (state && entry.state !== state) return false;
    if (category && entry.category.toUpperCase() !== category.toUpperCase()) return false;
    if (quota && entry.quota !== quota) return false;
    return true;
  });

  matches.sort((a, b) => a.closingRank - b.closingRank);

  return NextResponse.json({
    rank,
    state: state || 'All States',
    category: category || 'All',
    quota: quota || 'All',
    totalMatches: matches.length,
    results: matches,
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
