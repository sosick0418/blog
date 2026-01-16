import Link from "next/link";

const categories = [
  { name: "가전/디지털", href: "/category/electronics" },
  { name: "생활/가구", href: "/category/home" },
  { name: "뷰티", href: "/category/beauty" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-default)] bg-[var(--background-secondary)]">
      {/* Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">테크리뷰</span>
            </Link>
            <p className="text-[var(--foreground-muted)] max-w-md leading-relaxed">
              최신 제품의 솔직한 리뷰와 구매 가이드를 제공합니다. 가전, 디지털,
              뷰티 등 다양한 카테고리의 제품을 꼼꼼하게 분석하여 여러분의 현명한
              소비를 돕습니다.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              카테고리
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-[var(--foreground-muted)] hover:text-white hover-underline transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          {/* <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              정보
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[var(--foreground-muted)] hover:text-white hover-underline transition-colors"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[var(--foreground-muted)] hover:text-white hover-underline transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[var(--foreground-muted)] hover:text-white hover-underline transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border-default)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--foreground-subtle)]">
              © {new Date().getFullYear()} 테크리뷰. All rights reserved.
            </p>

            {/* Affiliate Disclosure */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--background-elevated)] border border-[var(--border-default)]">
              <svg
                className="w-4 h-4 text-[var(--accent-cta)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-[var(--foreground-muted)]">
                이 페이지는 쿠팡 파트너스 활동의 일환으로, 일정액의 수수료를
                제공받습니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
