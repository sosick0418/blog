import { Header, Footer, ProductCard } from "@/components";
import { getProductsByCategory } from "@/data/products";
import { categories } from "@/data/site";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryData = categories.find((c) => c.slug === category);

  if (!categoryData) {
    return {
      title: "카테고리를 찾을 수 없습니다",
    };
  }

  return {
    title: `${categoryData.name} 리뷰`,
    description: `${categoryData.name} 카테고리의 제품 리뷰`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryData = categories.find((c) => c.slug === category);

  if (!categoryData) {
    notFound();
  }

  const products = getProductsByCategory(category);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background)]" />
          <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br ${categoryData.color} opacity-20 rounded-full blur-[120px]`} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
              <Link href="/" className="hover:text-white transition-colors">홈</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{categoryData.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl">{categoryData.icon}</span>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {categoryData.name}
                </h1>
                <p className="text-[var(--foreground-muted)] mt-2">
                  {products.length}개의 리뷰
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    variant="default"
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[var(--foreground-muted)] text-lg">
                  이 카테고리에는 아직 리뷰가 없습니다.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 px-6 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-semibold hover:bg-[var(--accent-primary)]/90 transition-colors"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
