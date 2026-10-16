import fs from "node:fs";
import path from "node:path";

const tempDir = process.env.TEMP || process.env.TMP;
if (!tempDir) throw new Error("TEMP directory is unavailable");

function read(name) {
  return JSON.parse(
    fs.readFileSync(path.join(tempDir, `amw-${name}.json`), "utf8"),
  );
}

function minimal(item) {
  return {
    slug: item.slug,
    updatedAt: item.updatedAt,
    ...(item.seo
      ? {
          seo: {
            ...(item.seo.noindex ? { noindex: true } : {}),
            ...(item.seo.canonicalUrl
              ? { canonicalUrl: item.seo.canonicalUrl }
              : {}),
          },
        }
      : {}),
  };
}

const fallback = {
  generatedAt: new Date().toISOString(),
  countries: read("countries").data.map(minimal),
  universities: read("universities").data.map(minimal),
  blogs: [],
  indiaPages: [],
  urls: [],
};

const sitemapBodyPath = path.resolve(".next/server/app/sitemap.xml.body");
if (fs.existsSync(sitemapBodyPath)) {
  const xml = fs.readFileSync(sitemapBodyPath, "utf8");
  fallback.urls = [
    ...xml.matchAll(
      /<url>\s*<loc>(.*?)<\/loc>(?:\s*<lastmod>(.*?)<\/lastmod>)?/gs,
    ),
  ].map((match) => ({
    url: match[1],
    ...(match[2] ? { lastModified: match[2] } : {}),
  }));
}

const outputPath = path.resolve("src/data/sitemap-fallback.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(fallback, null, 2)}\n`);
console.log(
  `Wrote ${fallback.countries.length} countries, ${fallback.universities.length} universities, and ${fallback.urls.length} last-known-good URLs to ${outputPath}`,
);
