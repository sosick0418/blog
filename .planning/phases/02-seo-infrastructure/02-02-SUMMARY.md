# Plan 02-02 Summary: robots.txt and sitemap.xml

## Status: COMPLETE

## Tasks Completed

### Task 1: Create robots.txt template
- **File**: `src/robots.njk`
- **Commit**: c539469
- **Output**: Generates `_site/robots.txt` with User-agent, Allow, and Sitemap directives

### Task 2: Create sitemap.xml template
- **File**: `src/sitemap.njk`
- **Commit**: f50cdbb
- **Output**: Generates `_site/sitemap.xml` with all pages from collections.all

### Task 3: Add dateToISO filter to eleventy.config.js
- **File**: `eleventy.config.js`
- **Commit**: 930d297
- **Output**: Adds `dateToISO` filter that formats dates as YYYY-MM-DD for sitemap

## Files Modified
- `src/robots.njk` (created)
- `src/sitemap.njk` (created)
- `eleventy.config.js` (modified)

## Verification Results
- [x] `npm run build` succeeds without errors
- [x] _site/robots.txt exists with User-agent and Sitemap directives
- [x] _site/sitemap.xml exists with valid XML structure
- [x] sitemap.xml contains at least one `<url>` entry (for index page)
- [x] sitemap.xml contains properly formatted `<lastmod>` dates

## Generated Output

### robots.txt
```
User-agent: *
Allow: /

Sitemap: /sitemap.xml
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
    <lastmod>2026-01-15</lastmod>
  </url>
</urlset>
```

## Notes
- The `site.url` in site.json is currently empty, so URLs in robots.txt and sitemap.xml are relative
- Once a domain is configured in `src/_data/site.json`, full URLs will be generated automatically
- Both files are excluded from collections to prevent them from appearing in navigation or other page lists
