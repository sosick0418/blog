# Plan 03-01 Summary: Product Review Post Template

## Status: COMPLETE

## Tasks Completed

### Task 1: Create post layout template
**Files:** `src/_includes/post.njk`, `eleventy.config.js`

Created post.njk layout extending base.njk with:
- Sets `type: article` to trigger Article JSON-LD schema from base.njk
- Product info section with: name, price (Korean won format), rating stars, affiliate link
- Semantic HTML structure (article, header, section elements)
- CTA section with affiliate disclosure notice
- Added custom 11ty filters:
  - `dateKorean`: formats dates as "YYYY년 M월 D일"
  - `numberFormat`: formats numbers with Korean locale separators (e.g., 299,000)

**Commits:**
- `fc7ac6c` feat(03-01): create post layout template
- `25d7ccc` feat(03-01): add Korean date and number format filters

### Task 2: Create sample product review post
**Files:** `src/posts/posts.json`, `src/posts/sample-product-review.md`

Created sample content structure:
- `posts.json`: Directory data file setting `layout: post.njk` and `tags: posts`
- `sample-product-review.md`: Korean product review demonstrating:
  - Product frontmatter schema (name, price, rating, affiliateLink, image)
  - Pros/cons review format
  - Purchase recommendation structure
  - Realistic Korean product review style

**Commit:**
- `959c5a4` feat(03-01): create sample product review post

## Verification Results

- [x] `npm run build` succeeds without errors
- [x] post.njk template exists in src/_includes/
- [x] Sample post exists in src/posts/
- [x] Built post at _site/posts/sample-product-review/index.html
- [x] Built post contains Article JSON-LD schema
- [x] Korean text renders correctly (date, price formatting)

## Files Modified

- `src/_includes/post.njk` (created)
- `eleventy.config.js` (modified - added filters)
- `src/posts/posts.json` (created)
- `src/posts/sample-product-review.md` (created)

## Deviations

- Added two custom 11ty filters (`dateKorean`, `numberFormat`) to `eleventy.config.js` to support Korean date and price formatting in the post template. This was necessary because Nunjucks doesn't have built-in support for these formats.

## Output

Post template is ready for product review content generation. The frontmatter schema supports:
- `title`: Post title
- `description`: SEO description
- `date`: Publication date
- `product.name`: Product name
- `product.price`: Price in won (displayed with comma separators)
- `product.rating`: Star rating (1-5)
- `product.affiliateLink`: Coupang affiliate URL
- `product.image`: Product image path
