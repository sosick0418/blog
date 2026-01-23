import { Header, Footer, LargeAffiliateCTA } from "@/components";
import { products, getProductBySlug, getAllSlugs, slugify, type Product } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  electronics: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
  home: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  beauty: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  fashion: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  luggage: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
};

const categoryNames: Record<string, string> = {
  electronics: "가전/디지털",
  home: "생활/가구",
  beauty: "뷰티",
  fashion: "패션",
  luggage: "여행/캐리어",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price);
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= fullStars;
        const isHalf = star === fullStars + 1 && hasHalfStar;

        return (
          <div key={star} className="relative w-5 h-5">
            {/* Empty star background */}
            <svg
              className="absolute w-5 h-5 text-[var(--border-subtle)]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Filled or half star */}
            {(isFull || isHalf) && (
              <svg
                className="absolute w-5 h-5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : {}}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
        );
      })}
      <span className="ml-2 text-[var(--foreground-muted)]">{rating}/5</span>
    </div>
  );
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    slug,
  }));
}

const siteUrl = "https://bichonhenry.cloud";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "리뷰를 찾을 수 없습니다",
    };
  }

  const categoryName = categoryNames[product.category] || product.category;

  return {
    title: `${product.name} 리뷰 - ${categoryName} 추천`,
    description: `${product.name} 상세 리뷰. ${product.description} 쿠팡 최저가 ${product.price.toLocaleString()}원, 장단점 분석, 구매 가이드.`,
    keywords: [product.name, categoryName, "리뷰", "쿠팡", "추천", "최저가"],
    alternates: {
      canonical: `${siteUrl}/review/${slugify(product.name)}/`,
    },
    openGraph: {
      type: "article",
      title: `${product.name} 리뷰 | 테크리뷰`,
      description: `${product.description} - 쿠팡 최저가 ${product.price.toLocaleString()}원`,
      url: `${siteUrl}/review/${slugify(product.name)}/`,
      images: [
        {
          url: product.imageUrl,
          width: 600,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} 리뷰`,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

// Generate Product JSON-LD structured data
function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
      url: product.affiliateUrl || `${siteUrl}/review/${slugify(product.name)}/`,
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1,
      },
    }),
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.rating || 4,
        bestRating: 5,
      },
      author: {
        "@type": "Organization",
        name: "테크리뷰",
      },
      reviewBody: product.content?.split('\n')[0] || product.description,
    },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const colors = categoryColors[product.category] || categoryColors.electronics;
  const categoryName = categoryNames[product.category] || product.category;
  const productJsonLd = generateProductJsonLd(product);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background)]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-8">
              <Link href="/" className="hover:text-white transition-colors">홈</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/category/${product.category}/`} className="hover:text-white transition-colors">
                {categoryName}
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Product Image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--background-elevated)] border border-[var(--border-default)]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />

                {/* Rating Badge */}
                {product.rating && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border-default)]">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-white">{product.rating}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                {/* Category */}
                <span className={`category-chip inline-block px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-4`}>
                  {categoryName}
                </span>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-lg text-[var(--foreground-muted)] mb-6">
                  {product.description}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="mb-6">
                    <StarRating rating={product.rating} />
                  </div>
                )}

                {/* Price */}
                <div className="mb-8">
                  <span className="text-sm text-[var(--foreground-subtle)] block mb-1">최저가</span>
                  <span className="price text-4xl font-bold text-white">
                    {formatPrice(product.price)}
                    <span className="text-lg text-[var(--foreground-muted)] ml-1">원</span>
                  </span>
                </div>

                {/* CTA */}
                <LargeAffiliateCTA
                  href={product.affiliateUrl || "#"}
                  productName={product.name}
                  price={product.price}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Specs Section */}
        {product.specs && product.specs.length > 0 && (
          <section className="py-12 bg-[var(--background-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-white mb-8">주요 스펙</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-4 rounded-xl bg-[var(--background-elevated)] border border-[var(--border-default)]"
                  >
                    <span className="text-xs text-[var(--foreground-subtle)] block mb-1">
                      {spec.label}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pros & Cons */}
        {(product.pros || product.cons) && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pros */}
                {product.pros && product.pros.length > 0 && (
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-green-400">장점</h3>
                    </div>
                    <ul className="space-y-3">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-[var(--foreground-muted)]">
                          <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {product.cons && product.cons.length > 0 && (
                  <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-red-400">단점</h3>
                    </div>
                    <ul className="space-y-3">
                      {product.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-[var(--foreground-muted)]">
                          <svg className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        {product.content && (
          <section className="py-12 bg-[var(--background-secondary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-[var(--foreground-muted)] prose-p:leading-relaxed prose-strong:text-white prose-strong:font-semibold prose-ul:text-[var(--foreground-muted)] prose-li:marker:text-[var(--accent-primary)]">
                <ReactMarkdown>{product.content}</ReactMarkdown>
              </article>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <LargeAffiliateCTA
              href={product.affiliateUrl || "#"}
              productName={product.name}
              price={product.price}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
