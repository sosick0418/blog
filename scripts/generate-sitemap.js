#!/usr/bin/env node
/**
 * Generate sitemap.xml and robots.txt for static export
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const siteUrl = "https://bichonhenry.cloud";
const publicDir = join(__dirname, "../public");

// Read products from JSON
const productsPath = join(__dirname, "../src/data/products.json");
const products = JSON.parse(readFileSync(productsPath, "utf-8"));

// Slugify function (same as in products.ts)
function slugify(name) {
  return name
    .replace(/[+]/g, "-")
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

// Generate sitemap.xml
function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const categories = ["electronics", "home", "beauty"];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Category Pages -->
${categories
  .map(
    (cat) => `  <url>
    <loc>${siteUrl}/category/${cat}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}

  <!-- Product Review Pages -->
${products
  .map((product) => {
    const lastmod = product.updatedAt
      ? product.updatedAt.split("T")[0]
      : today;
    return `  <url>
    <loc>${siteUrl}/review/${slugify(product.name)}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  writeFileSync(join(publicDir, "sitemap.xml"), sitemap);
  console.log("Generated: sitemap.xml");
}

// Generate robots.txt
function generateRobots() {
  const robots = `# robots.txt for ${siteUrl}
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`;

  writeFileSync(join(publicDir, "robots.txt"), robots);
  console.log("Generated: robots.txt");
}

// Run
generateSitemap();
generateRobots();
console.log("SEO files generated successfully!");
