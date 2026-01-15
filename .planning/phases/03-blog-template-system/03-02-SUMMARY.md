# Plan 03-02 Summary: Index and Category Pages

## Status: COMPLETE

## Tasks Completed

### Task 1: Update index.njk to list posts
**Files:** `src/index.njk`

Updated homepage with post listing functionality:
- Added "최신 리뷰" (Latest Reviews) section heading
- Loop through `collections.posts` reversed for newest-first ordering
- Each post displays: title as link, date (Korean format), description
- Empty state handling with Korean message: "아직 등록된 리뷰가 없습니다."
- Semantic HTML structure: section, article, time elements

**Commit:**
- `0ef3ed8` feat(03-02): update index page with post listing

### Task 2: Create category template and sample category
**Files:** `src/_includes/category.njk`, `src/categories/electronics.njk`, `src/posts/sample-product-review.md`

Created category system for filtering posts:

1. **category.njk** - Category layout template:
   - Extends base.njk
   - Filters `collections.posts` by `categoryTag` matching post's `category` frontmatter
   - Lists filtered posts with same formatting as index page
   - Empty state with Korean message: "이 카테고리에 등록된 리뷰가 없습니다."

2. **electronics.njk** - Sample category page:
   - Layout: category.njk
   - Title: 전자제품 (Electronics)
   - categoryTag: electronics
   - Description for SEO

3. **sample-product-review.md** - Updated with category:
   - Added `category: electronics` to frontmatter

**Commit:**
- `62cec41` feat(03-02): create category template and sample category

## Verification Results

- [x] `npm run build` succeeds without errors
- [x] Index page lists posts at `_site/index.html`
- [x] Category template exists at `src/_includes/category.njk`
- [x] Sample category page builds at `_site/categories/electronics/index.html`
- [x] Category page filters posts correctly (shows Galaxy Buds review)

## Files Modified

- `src/index.njk` (modified)
- `src/_includes/category.njk` (created)
- `src/categories/electronics.njk` (created)
- `src/posts/sample-product-review.md` (modified - added category)

## Deviations

None. All tasks completed as specified in the plan.

## Output

Index and category pages are ready:
- Homepage now displays all posts with Korean date formatting
- Category system enables filtering by product type
- Sample "전자제품" (electronics) category demonstrates the pattern
- Future categories can be added by creating new `.njk` files in `src/categories/`

Category page structure supports future expansion:
- 가전 (Home Appliances)
- 생활용품 (Living Products)
- 뷰티 (Beauty)
- 패션 (Fashion)
