// Product data - migrated from 11ty products.json
export interface Product {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  affiliateUrl?: string;
  rating?: number;
  specs?: { label: string; value: string }[];
  pros?: string[];
  cons?: string[];
  content?: string;
}

export const products: Product[] = [
  {
    productId: "e2e-test-001",
    name: "무선 블루투스 이어폰 프로",
    price: 49900,
    imageUrl: "https://placehold.co/600x600/1e293b/94a3b8?text=이어폰",
    category: "electronics",
    description: "고음질 무선 이어폰, 노이즈 캔슬링, 30시간 재생",
    affiliateUrl: "https://link.coupang.com/re/AFFSDP?lptag=TEST&pageKey=e2e-test-001",
    rating: 4,
    specs: [
      { label: "연결 방식", value: "Bluetooth 5.3" },
      { label: "재생 시간", value: "최대 30시간" },
      { label: "노이즈 캔슬링", value: "ANC 지원" },
      { label: "방수 등급", value: "IPX4" },
    ],
    pros: [
      "뛰어난 음질과 강력한 노이즈 캔슬링",
      "긴 배터리 수명",
      "가성비 대비 프리미엄 기능",
    ],
    cons: [
      "무선 충전 미지원",
    ],
    content: `
## 제품 소개

무선 블루투스 이어폰 프로는 가성비와 프리미엄 기능을 모두 갖춘 제품입니다. 최신 Bluetooth 5.3 기술을 탑재하여 안정적인 연결성을 제공하며, 액티브 노이즈 캔슬링(ANC) 기능으로 주변 소음을 효과적으로 차단합니다.

## 음질 테스트

중저음이 풍부하면서도 고음역대가 깨끗하게 재생됩니다. 특히 보컬 중심의 음악에서 뛰어난 해상도를 보여줍니다.

## 총평

5만원 미만의 가격에서 ANC, 긴 배터리, 좋은 음질을 모두 갖춘 제품을 찾고 계신다면 강력히 추천드립니다.
    `,
  },
  {
    productId: "7628154817",
    name: "삼성 갤럭시 버즈2 프로",
    price: 159000,
    imageUrl: "https://placehold.co/600x600/1e293b/94a3b8?text=갤럭시+버즈",
    category: "electronics",
    description: "삼성 프리미엄 무선 이어폰, ANC 노이즈캔슬링, 24비트 Hi-Fi 사운드",
    rating: 5,
    specs: [
      { label: "연결 방식", value: "Bluetooth 5.3" },
      { label: "재생 시간", value: "최대 29시간" },
      { label: "노이즈 캔슬링", value: "인텔리전트 ANC" },
      { label: "방수 등급", value: "IPX7" },
    ],
    pros: [
      "24비트 Hi-Fi 오디오",
      "삼성 기기와의 완벽한 호환성",
      "인텔리전트 ANC",
    ],
    cons: [
      "삼성 기기 외 일부 기능 제한",
    ],
    content: `
## 제품 소개

삼성 갤럭시 버즈2 프로는 삼성의 프리미엄 무선 이어폰입니다. 24비트 Hi-Fi 오디오를 지원하여 음원 본래의 풍부한 사운드를 전달합니다.

## 삼성 생태계

삼성 기기 사용자라면 원클릭 페어링, 자동 전환, 360 오디오 등의 편리한 기능을 모두 활용할 수 있습니다.
    `,
  },
  {
    productId: "6912458732",
    name: "애플 에어팟 프로 2세대",
    price: 329000,
    imageUrl: "https://placehold.co/600x600/1e293b/94a3b8?text=에어팟+프로",
    category: "electronics",
    description: "액티브 노이즈 캔슬링, 적응형 투명 모드, 공간 음향",
    rating: 5,
    specs: [
      { label: "연결 방식", value: "Bluetooth 5.3" },
      { label: "재생 시간", value: "최대 30시간" },
      { label: "노이즈 캔슬링", value: "적응형 ANC" },
      { label: "방수 등급", value: "IP54" },
    ],
    pros: [
      "최고 수준의 ANC 성능",
      "애플 생태계 완벽 통합",
      "공간 음향 지원",
    ],
    cons: [
      "높은 가격대",
      "안드로이드에서 기능 제한",
    ],
    content: `
## 제품 소개

에어팟 프로 2세대는 애플의 프리미엄 무선 이어폰으로, 업계 최고 수준의 노이즈 캔슬링과 공간 음향을 제공합니다.

## 애플 생태계

아이폰, 아이패드, 맥 간의 자동 전환이 매끄럽고, "나의 찾기"를 통해 분실 시에도 쉽게 찾을 수 있습니다.
    `,
  },
  {
    productId: "8234567891",
    name: "다이슨 V15 디텍트 무선청소기",
    price: 1190000,
    imageUrl: "https://placehold.co/600x600/1e293b/94a3b8?text=다이슨+V15",
    category: "home",
    description: "레이저 먼지 감지, 피조전기 센서, 최대 60분 사용",
    rating: 4,
    specs: [
      { label: "사용 시간", value: "최대 60분" },
      { label: "먼지통 용량", value: "0.77L" },
      { label: "무게", value: "3.1kg" },
      { label: "특수 기능", value: "레이저 먼지 감지" },
    ],
    pros: [
      "강력한 흡입력",
      "레이저로 미세먼지 시각화",
      "피조전기 센서로 자동 조절",
    ],
    cons: [
      "높은 가격",
      "다소 무거운 무게",
    ],
    content: `
## 제품 소개

다이슨 V15 디텍트는 레이저 먼지 감지 기능을 탑재한 프리미엄 무선청소기입니다. 눈에 보이지 않는 미세먼지까지 레이저로 시각화하여 청소합니다.

## 특징

피조전기 센서가 먼지 양을 실시간으로 감지하여 자동으로 흡입력을 조절합니다.
    `,
  },
  {
    productId: "5467123890",
    name: "LG 퓨리케어 공기청정기",
    price: 489000,
    imageUrl: "https://placehold.co/600x600/1e293b/94a3b8?text=LG+퓨리케어",
    category: "home",
    description: "360도 청정, 스마트 인버터 모터, 초미세먼지 99.9% 제거",
    rating: 4,
    specs: [
      { label: "적용 면적", value: "최대 62㎡" },
      { label: "필터", value: "360도 HEPA" },
      { label: "소음", value: "최저 22dB" },
      { label: "스마트 기능", value: "ThinQ 앱 연동" },
    ],
    pros: [
      "360도 전방향 청정",
      "저소음 설계",
      "LG ThinQ 앱 연동",
    ],
    cons: [
      "필터 교체 비용",
    ],
    content: `
## 제품 소개

LG 퓨리케어는 360도 전방향 공기청정이 가능한 프리미엄 공기청정기입니다. 초미세먼지 PM1.0까지 99.9% 제거합니다.
    `,
  },
  {
    productId: "3892156478",
    name: "설화수 윤조에센스 90ml",
    price: 125000,
    imageUrl: "https://placehold.co/600x600/1e293b/94a3b8?text=설화수",
    category: "beauty",
    description: "한방 발효 에센스, 피부결 개선, 윤기 부여",
    rating: 5,
    specs: [
      { label: "용량", value: "90ml" },
      { label: "피부 타입", value: "모든 피부" },
      { label: "주요 성분", value: "자음단™" },
      { label: "사용법", value: "스킨 후 사용" },
    ],
    pros: [
      "피부결 개선 효과",
      "은은한 한방 향",
      "빠른 흡수력",
    ],
    cons: [
      "높은 가격대",
    ],
    content: `
## 제품 소개

설화수 윤조에센스는 한방 발효 에센스의 대표 제품입니다. 자음단™ 성분으로 피부 본연의 균형을 찾아주고 윤기를 부여합니다.

## 사용감

가볍게 스며들면서 피부를 촉촉하게 만들어줍니다. 은은한 한방 향이 특징입니다.
    `,
  },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => slugify(p.name) === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function slugify(name: string): string {
  return name.replace(/\s+/g, "-").toLowerCase();
}

export function getAllSlugs(): string[] {
  return products.map(p => slugify(p.name));
}
