"use client";

interface AffiliateCTAProps {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export default function AffiliateCTA({
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
}: AffiliateCTAProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 overflow-hidden group active:scale-[0.97]";

  const variants = {
    primary: `
      bg-gradient-to-r from-[var(--accent-cta)] to-orange-400
      text-white
      hover:from-[var(--accent-cta-hover)] hover:to-orange-500
      hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)]
      active:scale-[0.98]
    `,
    secondary: `
      bg-[var(--background-elevated)]
      text-white
      border border-[var(--border-subtle)]
      hover:border-[var(--accent-cta)]
      hover:text-[var(--accent-cta)]
      hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent
      text-[var(--accent-cta)]
      hover:bg-[var(--accent-cta)]/10
      active:scale-[0.98]
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
      `}
      onClick={(e) => {
        // Track affiliate click (placeholder for analytics)
        console.log("Affiliate click:", href);
      }}
    >
      {/* Shimmer Effect */}
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      )}

      {/* Icon */}
      <span className="relative z-10 flex items-center gap-2">
        {children || (
          <>
            <span>쿠팡에서 보기</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </>
        )}
      </span>

      {/* Rocket Partnership Badge */}
      {variant === "primary" && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cta)] opacity-30" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-[var(--accent-cta)] items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        </span>
      )}
    </a>
  );
}

// Large CTA for post pages
export function LargeAffiliateCTA({ href, productName, price }: { href: string; productName: string; price: number }) {
  const formattedPrice = new Intl.NumberFormat("ko-KR").format(price);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[var(--background-elevated)] to-[var(--background-secondary)] border border-[var(--border-default)] p-6 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center gap-6">
        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-[var(--foreground-muted)] mb-2">지금 쿠팡에서 확인하세요</p>
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">
            {productName}
          </h3>
          <p className="text-3xl lg:text-4xl font-bold text-[var(--accent-cta)]">
            <span className="price">{formattedPrice}</span>
            <span className="text-lg text-[var(--foreground-muted)] ml-1">원</span>
          </p>
          <p className="text-xs text-[var(--foreground-subtle)] mt-2">
            * 가격은 변동될 수 있습니다
          </p>
        </div>

        {/* CTA Button */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-cta)] to-orange-400 text-white font-bold text-lg overflow-hidden hover:from-[var(--accent-cta-hover)] hover:to-orange-500 transition-all duration-300 hover:shadow-[0_0_50px_-10px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
        >
          {/* Shimmer */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="relative z-10">쿠팡에서 구매하기</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      {/* Trust Badge */}
      <div className="relative flex items-center justify-center gap-4 mt-6 pt-6 border-t border-[var(--border-default)]">
        <span className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          안전한 쿠팡 결제
        </span>
        <span className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-1-1h-1V6a1 1 0 00-1-1H3z" />
          </svg>
          로켓배송
        </span>
        <span className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          리뷰 다수
        </span>
      </div>
    </div>
  );
}
