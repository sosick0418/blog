# Plan 04-03 Summary: Affiliate Links and Post Generation

## Status: COMPLETE

## Tasks Completed

### Task 1: Implement affiliate link generator
**Files:** `src/_data/coupang/affiliate.js`

Created dedicated affiliate link module with:

**Functions:**
- `generateAffiliateLink(productId, options)` - Creates tracking-enabled affiliate URLs
  - Validates productId input
  - Uses partner ID from environment/config
  - Supports custom subId for tracking
  - Supports optional campaign parameter (utm_campaign)
  - Falls back to direct product URL when partner ID not configured

- `parseProductUrl(url)` - Extracts productId from various Coupang URL formats
  - Direct product URLs: `coupang.com/vp/products/{id}`
  - Mobile URLs: `m.coupang.com/vm/products/{id}`
  - Affiliate links: `link.coupang.com/re/AFFSDP?pageKey={id}`
  - Query parameter formats: `itemId` or `pageKey`

- `createAffiliateLinkFromUrl(url, options)` - Convenience function combining parse and generate

**Commit:**
- `b2b7804` feat(04-03): implement affiliate link generator with URL parser

### Task 2: Create post generation script
**Files:** `scripts/generate-post.js`, `package.json`

Created CLI script for automated markdown post generation:

**Usage:**
```bash
# Single product
node scripts/generate-post.js --product <id> --name <name> [options]

# Batch from JSON file
node scripts/generate-post.js --file <products.json> [options]

# npm script
npm run generate:post -- --product 12345 --name "Product"
```

**Features:**
- Single product generation with CLI arguments
- Batch processing from JSON file
- Korean slug support for filenames
- Proper YAML frontmatter generation
- LLM placeholder content structure for Phase 5
- File existence checking with `--force` override
- Category and subId customization options

**Generated Post Structure:**
```markdown
---
title: "{name} 리뷰"
description: "{name} 상세 리뷰 및 구매 가이드"
date: {YYYY-MM-DD}
category: {category}
product:
  name: "{name}"
  price: {price}
  rating: {rating}
  affiliateLink: "{tracking link}"
  image: "{image}"
---

<!-- LLM content placeholder -->
## 제품 소개
## 장점
## 단점
## 구매 추천
## 총평
```

**npm Script Added:**
- `npm run generate:post` - Runs the post generation script

**Commit:**
- `6d032f3` feat(04-03): create post generation script with npm script

## Verification Results

- [x] `src/_data/coupang/affiliate.js` exports generateAffiliateLink
- [x] Affiliate link includes partner tracking ID (lptag parameter)
- [x] `scripts/generate-post.js` creates valid markdown files
- [x] Generated post builds successfully with 11ty
- [x] `npm run generate:post` script works
- [x] `npm run build` succeeds with generated posts

## Files Created/Modified

- `src/_data/coupang/affiliate.js` (created)
- `scripts/generate-post.js` (created)
- `package.json` (modified - added generate:post script)

## Deviations

None - implementation followed plan specifications.

## Integration with Existing Modules

The affiliate.js module works alongside existing modules:

```
src/_data/coupang/
├── config.js       # Configuration (from 04-01)
├── index.js        # Main entry, transformProductData (from 04-01)
└── affiliate.js    # Affiliate link generation (04-03) ← NEW
```

The post generation script uses:
- `affiliate.js` for link generation
- Frontmatter schema matching `sample-product-review.md`
- Posts directory structure from Phase 3

## Phase 4 Completion Status

With 04-03 complete, Phase 4 (Coupang Integration) is now functionally complete:

| Plan | Description | Status |
|------|-------------|--------|
| 04-01 | Research and module structure | Complete |
| 04-02 | Sample products.json | Pending |
| 04-03 | Affiliate links and post generation | **Complete** |

The system now supports:
1. Manual product data entry with affiliate link generation
2. Automated post file creation from product data
3. Ready for Phase 5 (LLM Content Generation)
