// Site configuration - migrated from 11ty site.json
export const siteConfig = {
  title: "테크리뷰",
  description: "인기 쿠팡 제품에 대한 상세 리뷰와 추천",
  language: "ko",
  locale: "ko_KR",
  url: "https://bichonhenry.cloud",
  author: "테크리뷰",
  image: "/og-default.jpg",
  twitter: "",
  type: "website",
};

export const categories = [
  { name: "가전/디지털", slug: "electronics", icon: "💻", color: "from-violet-500 to-purple-600" },
  { name: "생활/가구", slug: "home", icon: "🏠", color: "from-cyan-500 to-blue-600" },
  { name: "뷰티", slug: "beauty", icon: "✨", color: "from-pink-500 to-rose-600" },
];
