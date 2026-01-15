import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generate product review content using Gemini
 * @param {Object} productInfo - Product information
 * @returns {Object} Generated content (description, pros, cons, specs, content)
 */
export async function generateReviewContent(productInfo) {
  if (!GEMINI_API_KEY) {
    console.warn('[LLM] No GEMINI_API_KEY set, using placeholder content');
    return generatePlaceholderContent(productInfo);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = buildPrompt(productInfo);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return parseGeneratedContent(text, productInfo);
  } catch (error) {
    console.error('[LLM] Generation failed:', error.message);
    console.warn('[LLM] Falling back to placeholder content');
    return generatePlaceholderContent(productInfo);
  }
}

/**
 * Build the prompt for Gemini
 */
function buildPrompt(productInfo) {
  const { name, price, category, rating, imageUrl } = productInfo;

  return `당신은 전문 제품 리뷰어입니다. 다음 제품에 대한 상세하고 SEO 최적화된 한국어 리뷰를 작성해주세요.

제품 정보:
- 제품명: ${name}
- 가격: ${price ? `${price.toLocaleString()}원` : '가격 정보 없음'}
- 카테고리: ${category || '일반'}
- 평점: ${rating || '없음'}/5

다음 형식의 JSON으로 응답해주세요:
{
  "description": "제품 한 줄 설명 (50자 이내)",
  "specs": [
    {"label": "스펙명", "value": "스펙값"},
    {"label": "스펙명", "value": "스펙값"}
  ],
  "pros": ["장점1", "장점2", "장점3"],
  "cons": ["단점1", "단점2"],
  "content": "## 제품 소개\\n\\n상세 리뷰 내용...\\n\\n## 사용 후기\\n\\n..."
}

주의사항:
1. 실제 사용 경험을 바탕으로 작성하듯이 자연스럽게 작성
2. SEO를 위해 제품명과 관련 키워드를 자연스럽게 포함
3. 구매를 유도하는 긍정적인 톤 유지
4. specs는 4-6개 정도
5. content는 마크다운 형식으로 ## 제목 사용
6. 반드시 유효한 JSON 형식으로 응답

JSON만 응답하세요:`;
}

/**
 * Parse the generated content from Gemini response
 */
function parseGeneratedContent(text, productInfo) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      description: parsed.description || `${productInfo.name} 상세 리뷰`,
      specs: parsed.specs || [],
      pros: parsed.pros || [],
      cons: parsed.cons || [],
      content: parsed.content || ''
    };
  } catch (error) {
    console.error('[LLM] Failed to parse response:', error.message);
    return generatePlaceholderContent(productInfo);
  }
}

/**
 * Generate placeholder content when LLM is unavailable
 */
function generatePlaceholderContent(productInfo) {
  const { name, category } = productInfo;

  const categorySpecs = {
    electronics: [
      { label: '연결 방식', value: 'Bluetooth 5.0' },
      { label: '배터리', value: '최대 20시간' },
      { label: '무게', value: '경량 설계' },
      { label: '보증', value: '1년' }
    ],
    home: [
      { label: '소재', value: '프리미엄 소재' },
      { label: '크기', value: '다양한 사이즈' },
      { label: '색상', value: '다양한 컬러' },
      { label: '보증', value: '1년' }
    ],
    beauty: [
      { label: '용량', value: '정품 용량' },
      { label: '피부 타입', value: '모든 피부' },
      { label: '주요 성분', value: '프리미엄 성분' },
      { label: '유통기한', value: '제조일로부터 3년' }
    ]
  };

  return {
    description: `${name} - 품질과 가성비를 모두 갖춘 추천 제품`,
    specs: categorySpecs[category] || categorySpecs.electronics,
    pros: [
      '뛰어난 품질',
      '합리적인 가격',
      '빠른 배송'
    ],
    cons: [
      '인기 상품으로 품절 가능성'
    ],
    content: `## 제품 소개

${name}은(는) 많은 사용자들에게 사랑받는 제품입니다. 품질과 가성비를 모두 갖추고 있어 추천드립니다.

## 구매 포인트

이 제품의 가장 큰 장점은 뛰어난 품질 대비 합리적인 가격입니다. 쿠팡 로켓배송으로 빠르게 받아보실 수 있습니다.

## 총평

${name}을(를) 찾고 계신다면 이 제품을 강력히 추천드립니다.`
  };
}
