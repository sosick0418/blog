import type { Metadata } from "next";
import { Header, Footer, Hero, ProductCard } from "@/components";
import { products, getProductsByCategory } from "@/data/products";
import { categories, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Home() {
  // Count products per category
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: getProductsByCategory(cat.slug).length,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <section className="py-16 lg:py-24 border-b border-[var(--border-default)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                카테고리별 리뷰
              </h2>
              <p className="text-[var(--foreground-muted)]">
                관심있는 카테고리를 선택해보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoriesWithCount.map((category) => (
                <a
                  key={category.slug}
                  href={`/category/${category.slug}/`}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-[var(--background-secondary)] border border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 transition-all duration-500"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {category.count}개의 리뷰
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 ml-auto text-[var(--foreground-subtle)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Reviews Section */}
        <section id="reviews" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="category-chip text-[var(--accent-primary)] mb-2 block">
                  Featured
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  인기 리뷰
                </h2>
                <p className="text-[var(--foreground-muted)] mt-2">
                  가장 많이 본 제품 리뷰
                </p>
              </div>
            </div>

            {/* Product Grid - Magazine Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
              {/* Featured Product - Takes 2x2 */}
              {products[0] && (
                <ProductCard
                  product={products[0]}
                  variant="featured"
                  index={0}
                />
              )}

              {/* Regular Products */}
              {products.slice(1, 4).map((product, index) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  variant="default"
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Reviews Section */}
        {products.length > 4 && (
          <section className="py-16 lg:py-24 bg-[var(--background-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <div>
                  <span className="category-chip text-green-400 mb-2 block">
                    Latest
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    최신 리뷰
                  </h2>
                  <p className="text-[var(--foreground-muted)] mt-2">
                    방금 업데이트된 리뷰
                  </p>
                </div>
              </div>

              {/* Grid of remaining products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(4).map((product, index) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    variant="default"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter/CTA Section */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 via-transparent to-violet-500/10" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              새로운 리뷰를 놓치지 마세요
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg mb-8 max-w-2xl mx-auto">
              매주 새로운 제품 리뷰와 구매 가이드를 업데이트합니다.
              즐겨찾기에 추가하고 최신 리뷰를 확인하세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--background-elevated)] border border-[var(--border-subtle)] text-white font-semibold hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>즐겨찾기 추가</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
