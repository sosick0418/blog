/**
 * LLM Prompt Templates Module
 * Contains prompt templates for Korean product review generation
 */

/**
 * System prompt for Korean product reviewer persona
 * Sets the tone, style, and format for review generation
 */
export const SYSTEM_PROMPT = `당신은 한국의 신뢰받는 제품 리뷰어입니다. 쿠팡에서 판매되는 제품에 대한 상세하고 솔직한 리뷰를 작성합니다.

작성 스타일:
- 친근하고 대화하듯이 작성하세요
- 직접 사용해본 것처럼 자연스럽게 작성하세요
- 장점과 단점을 균형있게 다루세요
- 구매 결정에 도움이 되는 실용적인 정보를 포함하세요

형식:
- 마크다운 형식으로 작성
- 총 500-800 단어
- 각 섹션에 적절한 제목(##, ###) 사용`;

/**
 * Build a user prompt for product review generation
 * @param {Object} product - Product information
 * @param {string} product.name - Product name
 * @param {number} [product.price] - Product price in KRW
 * @param {string} [product.category] - Product category
 * @param {string} [product.description] - Product description
 * @returns {string} Formatted user prompt in Korean
 */
export function buildUserPrompt(product) {
  if (!product || !product.name) {
    throw new Error('Product object with name is required');
  }

  const priceText = product.price
    ? `${product.price.toLocaleString('ko-KR')}원`
    : '가격 정보 없음';

  const categoryText = product.category
    ? `카테고리: ${product.category}`
    : '';

  const descriptionText = product.description
    ? `제품 설명: ${product.description}`
    : '';

  return `다음 제품에 대한 상세 리뷰를 작성해주세요.

제품명: ${product.name}
가격: ${priceText}
${categoryText}
${descriptionText}

다음 구조로 리뷰를 작성해주세요:

## 제품 소개
제품의 기본 정보와 특징을 소개하며, 어떤 용도로 사용하는지 설명해주세요.

## 장점
3-4가지 장점을 각각 소제목(###)으로 구분하여 상세히 설명해주세요.
실제 사용 경험을 바탕으로 구체적인 예시를 포함해주세요.

## 단점
1-2가지 단점을 솔직하게 언급해주세요.
단점도 각각 소제목(###)으로 구분해주세요.

## 총평
전체적인 평가와 함께 다음 내용을 포함해주세요:
- 추천 대상 (이런 분들께 추천)
- 비추천 대상 (이런 분들께는 비추천)

리뷰는 한국어로 작성하고, 마크다운 형식을 사용해주세요.`.trim();
}

/**
 * Build a prompt for generating SEO meta description
 * @param {Object} product - Product information
 * @param {string} product.name - Product name
 * @param {string} [product.category] - Product category
 * @returns {string} Prompt for meta description generation
 */
export function buildMetaDescription(product) {
  if (!product || !product.name) {
    throw new Error('Product object with name is required');
  }

  const categoryContext = product.category
    ? `(${product.category} 카테고리)`
    : '';

  return `다음 제품에 대한 SEO 메타 설명을 작성해주세요.

제품명: ${product.name} ${categoryContext}

요구사항:
- 150자 이내로 작성
- 검색 엔진 최적화를 위해 핵심 키워드 포함
- 사용자의 클릭을 유도하는 매력적인 문구
- 한국어로 작성
- 마크다운 형식 없이 순수 텍스트만

메타 설명만 출력하세요. 다른 설명이나 주석은 포함하지 마세요.`.trim();
}

/**
 * Format and clean LLM output for review content
 * @param {string} content - Raw LLM output
 * @returns {string} Cleaned and formatted markdown string
 */
export function formatReviewOutput(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let formatted = content.trim();

  // Remove any markdown code block wrappers that LLM might add
  formatted = formatted.replace(/^```markdown\n?/i, '');
  formatted = formatted.replace(/\n?```$/i, '');
  formatted = formatted.replace(/^```\n?/, '');

  // Ensure consistent heading hierarchy (## for main sections, ### for subsections)
  // First, normalize any # headings to ## (main section level)
  formatted = formatted.replace(/^# ([^#\n]+)$/gm, '## $1');

  // Normalize multiple consecutive newlines to double newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Ensure there's a newline before ## headings for proper spacing
  formatted = formatted.replace(/([^\n])\n(## )/g, '$1\n\n$2');

  // Ensure there's a newline before ### headings for proper spacing
  formatted = formatted.replace(/([^\n])\n(### )/g, '$1\n\n$2');

  return formatted.trim();
}

export default {
  SYSTEM_PROMPT,
  buildUserPrompt,
  buildMetaDescription,
  formatReviewOutput,
};
