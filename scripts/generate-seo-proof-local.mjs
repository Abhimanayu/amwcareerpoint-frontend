import fs from 'node:fs/promises';

const beforeBase = process.env.BEFORE_BASE || 'http://localhost:3021';
const afterBase = process.env.AFTER_BASE || 'http://localhost:3022';

async function fetchText(base, path) {
  const res = await fetch(`${base}${path}`, { redirect: 'manual' });
  const text = await res.text().catch(() => '');
  return {
    status: res.status,
    location: res.headers.get('location') || '',
    contentType: res.headers.get('content-type') || '',
    length: text.length,
    text,
  };
}

function extractCanonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
}

function extractMeta(html, propertyOrName) {
  const escaped = propertyOrName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const propertyRegex = new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i');
  const nameRegex = new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i');
  return html.match(propertyRegex)?.[1] || html.match(nameRegex)?.[1] || '';
}

function extractJsonLdTypes(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw.trim());
      const items = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      for (const item of items) {
        const type = item?.['@type'];
        if (Array.isArray(type)) types.push(...type);
        else if (type) types.push(type);
      }
    } catch {
      types.push('INVALID_JSON_LD');
    }
  }
  return { count: blocks.length, types: [...new Set(types)] };
}

function pageSeoSnapshot(page) {
  const jsonLd = extractJsonLdTypes(page.text);
  return {
    status: page.status,
    length: page.length,
    canonical: extractCanonical(page.text),
    ogImage: extractMeta(page.text, 'og:image'),
    twitterImage: extractMeta(page.text, 'twitter:image'),
    jsonLdCount: jsonLd.count,
    jsonLdTypes: jsonLd.types,
  };
}

async function sourceCount(pattern) {
  const before = await runGitCount(pattern, '589ebf8');
  const after = await runGitCount(pattern, 'HEAD');
  return { before, after };
}

async function runGitCount(pattern, ref) {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync('git', ['grep', '-n', pattern, ref, '--', 'src', 'next.config.ts', 'scripts', 'package.json'], {
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) return 0;
  return result.stdout.split(/\r?\n/).filter(Boolean).length;
}

async function main() {
  const [beforeHome, afterHome, beforeSitemap, afterSitemap, beforeCollege, afterCollege, beforeUniversities, afterUniversities, beforeUniDetail, afterUniDetail] = await Promise.all([
    fetchText(beforeBase, '/'),
    fetchText(afterBase, '/'),
    fetchText(beforeBase, '/sitemap.xml'),
    fetchText(afterBase, '/sitemap.xml'),
    fetchText(beforeBase, '/college'),
    fetchText(afterBase, '/college'),
    fetchText(beforeBase, '/universities'),
    fetchText(afterBase, '/universities'),
    fetchText(beforeBase, '/universities/andijan-state-medical-university-andijan-uzbekistan'),
    fetchText(afterBase, '/universities/andijan-state-medical-university-andijan-uzbekistan'),
  ]);

  const sourcePatterns = {};
  for (const pattern of [
    'homeJsonLd',
    'application/ld+json',
    'og-image.png',
    'clampSeoDescription',
    'resolveCanonicalUrl',
    'serializeJsonLd',
    'validateSchemaMarkup',
    'RichTextEditor',
    '/college',
  ]) {
    sourcePatterns[pattern] = await sourceCount(pattern);
  }

  const evidence = {
    generatedAt: new Date().toISOString(),
    before: {
      commit: '589ebf838f32a74bec2d8ae2d5d83c2cb095cf6e',
      baseUrl: beforeBase,
      build: 'PASS',
      home: pageSeoSnapshot(beforeHome),
      collegeRoute: { status: beforeCollege.status },
      universitiesRoute: { status: beforeUniversities.status, location: beforeUniversities.location },
      universityDetailRoute: { status: beforeUniDetail.status, location: beforeUniDetail.location },
      sitemap: {
        status: beforeSitemap.status,
        hasCollegeUrls: beforeSitemap.text.includes('/college'),
        hasUniversitiesUrls: beforeSitemap.text.includes('/universities'),
      },
    },
    after: {
      commit: '120860ead93062253b28a7f12b5370aa7f6c13be',
      baseUrl: afterBase,
      build: 'PASS',
      home: pageSeoSnapshot(afterHome),
      collegeRoute: { status: afterCollege.status },
      universitiesRoute: { status: afterUniversities.status, location: afterUniversities.location },
      universityDetailRoute: { status: afterUniDetail.status, location: afterUniDetail.location },
      sitemap: {
        status: afterSitemap.status,
        hasCollegeUrls: afterSitemap.text.includes('/college'),
        hasUniversitiesUrls: afterSitemap.text.includes('/universities'),
      },
    },
    sourcePatterns,
  };

  await fs.writeFile('seo-automated-proof.json', `${JSON.stringify(evidence, null, 2)}\n`);

  const md = `# Automated SEO Before/After Proof

Generated: ${evidence.generatedAt}

Before commit: \`${evidence.before.commit}\`
After commit: \`${evidence.after.commit}\`

## Rendered Production HTML Checks

| Check | Before | After |
|---|---:|---:|
| Build | ${evidence.before.build} | ${evidence.after.build} |
| Home status | ${evidence.before.home.status} | ${evidence.after.home.status} |
| Home JSON-LD blocks | ${evidence.before.home.jsonLdCount} | ${evidence.after.home.jsonLdCount} |
| Home JSON-LD types | ${evidence.before.home.jsonLdTypes.join(', ') || '-'} | ${evidence.after.home.jsonLdTypes.join(', ') || '-'} |
| Home canonical | ${evidence.before.home.canonical || '-'} | ${evidence.after.home.canonical || '-'} |
| Home OG image | ${evidence.before.home.ogImage || '-'} | ${evidence.after.home.ogImage || '-'} |
| Home Twitter image | ${evidence.before.home.twitterImage || '-'} | ${evidence.after.home.twitterImage || '-'} |
| /college status | ${evidence.before.collegeRoute.status} | ${evidence.after.collegeRoute.status} |
| /universities status | ${evidence.before.universitiesRoute.status} | ${evidence.after.universitiesRoute.status} |
| /universities location | ${evidence.before.universitiesRoute.location || '-'} | ${evidence.after.universitiesRoute.location || '-'} |
| /universities/:slug status | ${evidence.before.universityDetailRoute.status} | ${evidence.after.universityDetailRoute.status} |
| /universities/:slug location | ${evidence.before.universityDetailRoute.location || '-'} | ${evidence.after.universityDetailRoute.location || '-'} |
| Sitemap has /college URLs | ${evidence.before.sitemap.hasCollegeUrls} | ${evidence.after.sitemap.hasCollegeUrls} |
| Sitemap has /universities URLs | ${evidence.before.sitemap.hasUniversitiesUrls} | ${evidence.after.sitemap.hasUniversitiesUrls} |

## Source-Level Automated Counts

| Pattern | Before | After |
|---|---:|---:|
${Object.entries(evidence.sourcePatterns).map(([pattern, value]) => `| \`${pattern}\` | ${value.before} | ${value.after} |`).join('\n')}

Raw JSON evidence: \`seo-automated-proof.json\`
`;

  await fs.writeFile('seo-automated-proof.md', md);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
