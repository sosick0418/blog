---
phase: 01-foundation
plan: 02
status: complete
completed_at: 2025-01-15
commits: [0c61bce, 7cba58e]
---

# Plan 01-02 Summary: Base Layout Template

## Accomplishments

1. **Site Data Configuration Created**
   - Created src/_data/site.json with Korean site metadata
   - Configured title: "쿠팡 제품 리뷰" (Coupang Product Reviews)
   - Configured description: "인기 쿠팡 제품에 대한 상세 리뷰와 추천"
   - Set language: "ko" and locale: "ko_KR"
   - Data available globally in all templates as `site.*`

2. **Base Layout Template Created**
   - Created src/_includes/base.njk with semantic HTML5 structure
   - Korean language properly set in HTML (`lang="ko"`)
   - Dynamic title: "{{ title }} | {{ site.title }}" with fallback
   - Meta description with page-level override capability
   - Basic semantic structure: header (with nav), main, footer
   - Footer displays dynamic year using page.date.getFullYear()

3. **Index Page Updated**
   - Updated src/index.njk to use base.njk layout
   - Added front matter with layout and Korean title ("홈")
   - Content renders correctly with Korean characters

4. **Configuration Updated**
   - Removed separate layouts directory from eleventy.config.js
   - Layouts now served from _includes (standard 11ty pattern)

## Files Created/Modified

| File | Purpose |
|------|---------|
| src/_data/site.json | Global site configuration data |
| src/_includes/base.njk | Reusable base layout template |
| src/index.njk | Updated to use base layout |
| eleventy.config.js | Updated to use _includes for layouts |

## Decisions Made

1. **Layout Location: _includes/**
   - Placed layouts in _includes/ rather than separate _layouts/
   - This is the more common 11ty pattern
   - Simplifies directory structure

2. **Template Data Pattern**
   - Used Nunjucks conditional for title: `{% if title %}...{% else %}...{% endif %}`
   - Used `or` operator for description fallback: `{{ description or site.description }}`
   - Used `| safe` filter for content to allow HTML rendering

3. **Korean Localization**
   - Site title and description in Korean in site.json
   - Page titles can be Korean (홈 for Home)
   - lang="ko" set via site.language variable

## Verification Results

- [x] `npx @11ty/eleventy` builds without errors
- [x] _site/index.html includes Korean title from site.json
- [x] HTML has correct lang="ko" attribute
- [x] Page title includes both page title and site title ("홈 | 쿠팡 제품 리뷰")
- [x] Meta description is present

## Issues Encountered

1. **Layout Directory Mismatch**
   - Initial eleventy.config.js had separate `layouts: "_layouts"` directory
   - Resolved by removing layouts config (defaults to _includes)
   - Plan specified _includes, so config was updated accordingly

## Next Steps

- **01-03**: Add CSS/styling foundation
- **Phase 02**: SEO configuration (meta tags, sitemap, robots.txt)
