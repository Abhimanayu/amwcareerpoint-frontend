export interface CategoryParts {
  rawCategory: string;
  category: string;
  subCategory: string | null;
}

/**
 * Known base category tokens that can appear before a hyphen.
 * Used to gate the hyphen-split rule so we don't blindly split non-category strings.
 */
const KNOWN_BASES = new Set([
  'UR', 'OBC', 'SC', 'ST', 'EWS', 'BC', 'GEN', 'GENERAL',
  'MBC', 'SA', 'SBC', 'SEBC', 'NRI', 'SM', 'MM', 'OC',
]);

/**
 * Derive a (category, subCategory) pair from a raw category string, using
 * state-specific and general parsing rules. Never modifies neet-cutoff.json.
 *
 * Rules (in priority order):
 *  1. BC[A-E] → category=BC, subCategory=A/B/C/D/E
 *  2. Madhya Pradesh slash notation  (state-specific)
 *  3. Uttarakhand parentheses notation (state-specific)
 *  4. Hyphen with a known base category
 *  5. Fallback — keep raw as category, subCategory=null
 */
export function deriveCategoryParts(state: string, rawCategory: string): CategoryParts {
  const raw = rawCategory.trim();
  const upper = raw.toUpperCase();

  // ── Rule 1: BCA / BCB / BCC / BCD / BCE ──────────────────────────────────
  if (/^BC[A-E]$/i.test(raw)) {
    return { rawCategory: raw, category: 'BC', subCategory: upper[2] };
  }

  // ── Rule 2: Madhya Pradesh — slash notation ───────────────────────────────
  // e.g. OBC/FF/OP → category=OBC, subCategory=FF/OP
  if (state === 'Madhya Pradesh' && raw.includes('/')) {
    const slashIdx = raw.indexOf('/');
    const base = raw.substring(0, slashIdx).trim().toUpperCase();
    const sub = raw.substring(slashIdx + 1).trim();
    if (base) {
      return { rawCategory: raw, category: base, subCategory: sub || null };
    }
  }

  // ── Rule 3: Uttarakhand — parentheses notation ────────────────────────────
  // e.g. UR(WOMEN) → {UR, WOMEN}; OBC(NCL)(OPEN) → {OBC, NCL OPEN}
  if (state === 'Uttarakhand' && raw.includes('(')) {
    const parenIdx = raw.indexOf('(');
    const base = raw.substring(0, parenIdx).trim().toUpperCase();
    if (base) {
      const parenContents: string[] = [];
      const parenRegex = /\(([^)]+)\)/g;
      let m: RegExpExecArray | null;
      while ((m = parenRegex.exec(raw)) !== null) {
        const part = m[1].trim();
        if (part) parenContents.push(part.toUpperCase());
      }
      if (parenContents.length > 0) {
        return { rawCategory: raw, category: base, subCategory: parenContents.join(' ') };
      }
    }
  }

  // ── Rule 4: Hyphen with known base ────────────────────────────────────────
  // Normalize runs of hyphens and surrounding whitespace to a single hyphen,
  // then split at the first hyphen.
  // e.g. UR-FEMALE, SC-D, OBC-A, BC-I, BC-I-BLIND, UR--AUTISM, UR- BLIND
  if (raw.includes('-')) {
    const normalized = raw.replace(/\s*-+\s*/g, '-').trim();
    const firstHyphen = normalized.indexOf('-');
    if (firstHyphen > 0) {
      const base = normalized.substring(0, firstHyphen).toUpperCase();
      const sub = normalized.substring(firstHyphen + 1).toUpperCase();
      if (KNOWN_BASES.has(base) && sub.length > 0) {
        return { rawCategory: raw, category: base, subCategory: sub };
      }
    }
  }

  // ── Rule 5: Fallback ──────────────────────────────────────────────────────
  return { rawCategory: raw, category: upper, subCategory: null };
}
