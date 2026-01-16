import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://bichonhenry.cloud";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "테크리뷰 | 최신 제품 리뷰 & 추천",
    template: "%s | 테크리뷰",
  },
  description: "전문적인 제품 리뷰와 구매 가이드. 가전, 디지털, 뷰티 등 다양한 카테고리의 솔직한 리뷰를 만나보세요. 쿠팡 최저가 비교, 장단점 분석, 구매 꿀팁까지!",
  keywords: ["제품 리뷰", "쿠팡", "추천", "가전", "디지털", "뷰티", "구매 가이드", "쿠팡 최저가", "제품 비교", "쇼핑 추천"],
  authors: [{ name: "테크리뷰" }],
  creator: "테크리뷰",
  publisher: "테크리뷰",
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "테크리뷰",
    title: "테크리뷰 | 최신 제품 리뷰 & 추천",
    description: "전문적인 제품 리뷰와 구매 가이드. 쿠팡 최저가 비교, 장단점 분석!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "테크리뷰 - 최신 제품 리뷰",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "테크리뷰 | 최신 제품 리뷰 & 추천",
    description: "전문적인 제품 리뷰와 구매 가이드. 쿠팡 최저가 비교!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION || "",
    },
  },
};

// JSON-LD structured data for the website
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "테크리뷰",
  url: siteUrl,
  description: "전문적인 제품 리뷰와 구매 가이드",
  publisher: {
    "@type": "Organization",
    name: "테크리뷰",
    url: siteUrl,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
