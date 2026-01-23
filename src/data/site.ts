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

import { products } from "./products";

const categoryMeta: Record<string, { name: string; icon: string; color: string }> = {
  electronics: { name: "가전/디지털", icon: "💻", color: "from-violet-500 to-purple-600" },
  home: { name: "생활/가구", icon: "🏠", color: "from-cyan-500 to-blue-600" },
  beauty: { name: "뷰티", icon: "✨", color: "from-pink-500 to-rose-600" },
  fashion: { name: "패션", icon: "👕", color: "from-amber-500 to-orange-600" },
  luggage: { name: "여행/캐리어", icon: "🧳", color: "from-emerald-500 to-teal-600" },
};

const fallbackCategory = {
  name: "기타",
  icon: "📦",
  color: "from-slate-500 to-slate-600",
};

export function getAllCategories() {
  const categorySlugs = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter((category): category is string => typeof category === "string" && category.length > 0)
    )
  ).sort();

  return categorySlugs.map((slug) => {
    const meta = categoryMeta[slug] ?? fallbackCategory;
    return {
      slug,
      name: meta.name === fallbackCategory.name ? slug : meta.name,
      icon: meta.icon,
      color: meta.color,
    };
  });
}

export const categories = getAllCategories();
