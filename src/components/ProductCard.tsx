"use client";

import Image from "next/image";
import Link from "next/link";
import AffiliateCTA from "./AffiliateCTA";

interface Product {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  affiliateUrl?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "featured" | "compact";
  index?: number;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  electronics: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
  home: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  beauty: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  fashion: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
};

const categoryNames: Record<string, string> = {
  electronics: "가전/디지털",
  home: "생활/가구",
  beauty: "뷰티",
  fashion: "패션",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-amber-400" : "text-[var(--border-subtle)]"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, variant = "default", index = 0 }: ProductCardProps) {
  const colors = categoryColors[product.category] || categoryColors.electronics;
  const categoryName = categoryNames[product.category] || product.category;
  const slug = product.name.replace(/\s+/g, "-").toLowerCase();

  if (variant === "featured") {
    return (
      <article
        className={`group relative col-span-2 row-span-2 rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background-secondary)] border border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 transition-all duration-500 animate-fade-in-up stagger-${index + 1}`}
        style={{ opacity: 0 }}
      >
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Link href={`/review/${slug}`} className="block">
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-secondary)] via-transparent to-transparent" />

            {/* Featured Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold uppercase tracking-wider">
                Featured
              </span>
            </div>
          </div>

          <div className="relative p-6 lg:p-8 pb-0">
            {/* Category */}
            <span className={`category-chip inline-block px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-4`}>
              {categoryName}
            </span>

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-[var(--foreground-muted)] mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="mb-4">
                <StarRating rating={product.rating} />
              </div>
            )}
          </div>
        </Link>

        {/* Price & CTA - Outside Link to avoid nesting */}
        <div className="relative p-6 lg:p-8 pt-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs text-[var(--foreground-subtle)] block mb-1">
                최저가
              </span>
              <span className="price text-2xl lg:text-3xl text-white">
                {formatPrice(product.price)}
                <span className="text-sm ml-1">원</span>
              </span>
            </div>
            <AffiliateCTA
              href={product.affiliateUrl || "#"}
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article
        className={`group flex gap-4 p-4 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 animate-fade-in-up stagger-${index + 1}`}
        style={{ opacity: 0 }}
      >
        <Link href={`/review/${slug}`} className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-xl"
            sizes="80px"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <span className={`category-chip text-[10px] ${colors.text}`}>
            {categoryName}
          </span>
          <Link href={`/review/${slug}`}>
            <h3 className="font-semibold text-white group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1 mt-1">
              {product.name}
            </h3>
          </Link>
          <span className="price text-lg text-[var(--accent-cta)]">
            {formatPrice(product.price)}원
          </span>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article
      className={`group relative rounded-2xl overflow-hidden bg-[var(--background-secondary)] border border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.3)] transition-all duration-500 animate-fade-in-up stagger-${index + 1}`}
      style={{ opacity: 0 }}
    >
      <Link href={`/review/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-secondary)] via-transparent to-transparent opacity-60" />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[var(--accent-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5">
          {/* Category */}
          <span className={`category-chip inline-block px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-3`}>
            {categoryName}
          </span>

          {/* Title */}
          <h3 className="font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2 mb-2 text-lg">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-4">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="mb-4">
              <StarRating rating={product.rating} />
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="price text-xl text-white">
              {formatPrice(product.price)}
              <span className="text-sm text-[var(--foreground-muted)] ml-1">원</span>
            </span>
          </div>
        </div>
      </Link>

      {/* CTA */}
      <div className="px-5 pb-5">
        <AffiliateCTA
          href={product.affiliateUrl || "#"}
          variant="secondary"
          size="md"
          fullWidth
        />
      </div>
    </article>
  );
}
