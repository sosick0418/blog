# Plan 05-02 Summary: Korean Prompt Templates

## Status: COMPLETE

## Objective
Create prompt templates for Korean product review generation that produce compelling, SEO-friendly reviews designed to convert readers to affiliate clicks.

## Tasks Completed

### Task 1: Create prompt templates module
- **File**: `src/_data/llm/prompts.js`
- **Commit**: `642967e` - feat(05-02): create prompt templates module
- **Details**:
  - `SYSTEM_PROMPT` constant: Korean reviewer persona with style guidelines
    - Friendly, conversational tone
    - First-person perspective (as if used the product)
    - Balanced pros/cons coverage
    - Markdown format, 500-800 words target
  - `buildUserPrompt(product)` function: Generates structured review request
    - Korean won price formatting (e.g., 99,000원)
    - Section structure: 제품 소개, 장점 (3-4 with ### subheadings), 단점 (1-2), 총평
    - Includes 추천/비추천 대상 guidance
  - `buildMetaDescription(product)` function: SEO meta description prompt
    - 150자 (characters) limit
    - Keyword-focused for search optimization
  - `formatReviewOutput(content)` function: Cleans LLM output
    - Removes markdown code block wrappers
    - Normalizes heading hierarchy (# to ##)
    - Ensures consistent newline spacing

### Task 2: Update index.js to include prompts
- **File**: `src/_data/llm/index.js`
- **Commit**: `c23ea2c` - feat(05-02): update index.js with prompt exports and generateReview
- **Details**:
  - Re-exports all prompt functions from prompts.js
  - Added `generateReview(product)` convenience function:
    - Combines SYSTEM_PROMPT and buildUserPrompt
    - Calls generateProductReview from gemini.js
    - Applies formatReviewOutput to result
    - Returns final cleaned markdown content
  - Updated default export with all new functions

## Files Modified
| File | Action |
|------|--------|
| `src/_data/llm/prompts.js` | Created |
| `src/_data/llm/index.js` | Updated |

## Verification Results
- [x] `src/_data/llm/prompts.js` exists with all functions
- [x] SYSTEM_PROMPT is in Korean and sets reviewer role
- [x] buildUserPrompt produces Korean prompt with product data
- [x] index.js exports generateReview function
- [x] All modules import without errors
- [x] `npm run build` succeeds

## Commit Hashes
1. `642967e` - feat(05-02): create prompt templates module
2. `c23ea2c` - feat(05-02): update index.js with prompt exports and generateReview

## Key Korean Content Structure

### Review Output Structure (as designed)
```markdown
## 제품 소개
[Product introduction and use case]

## 장점
### [Advantage 1 Title]
[Description with specific examples]

### [Advantage 2 Title]
[Description with specific examples]

### [Advantage 3-4 Title]
[Description with specific examples]

## 단점
### [Disadvantage 1 Title]
[Honest limitation description]

### [Disadvantage 2 Title] (optional)
[Honest limitation description]

## 총평
[Overall assessment]

**추천 대상:**
- [Target audience 1]
- [Target audience 2]

**비추천 대상:**
- [Not recommended for 1]
- [Not recommended for 2]
```

## API Usage Example
```javascript
import { generateReview } from './src/_data/llm/index.js';

const review = await generateReview({
  name: '삼성 갤럭시 버즈3 프로',
  price: 299000,
  category: 'electronics',
  description: '프리미엄 무선 이어폰'
});
// Returns formatted Korean markdown review
```

## Notes
- Prompt templates follow the sample review structure from `sample-product-review.md`
- Korean won prices use `toLocaleString('ko-KR')` for proper formatting
- The `formatReviewOutput` function handles common LLM output quirks (code block wrappers, heading inconsistencies)
- Temperature set to 0.7 for creative but consistent output

## Next Steps
- Plan 05-03: LLM-Generated Post Pipeline (integrate prompts with post generation scripts)
