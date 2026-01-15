import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "테크리뷰 | 최신 제품 리뷰 & 추천",
    template: "%s | 테크리뷰",
  },
  description: "전문적인 제품 리뷰와 구매 가이드. 가전, 디지털, 뷰티 등 다양한 카테고리의 솔직한 리뷰를 만나보세요.",
  keywords: ["제품 리뷰", "쿠팡", "추천", "가전", "디지털", "뷰티", "구매 가이드"],
  authors: [{ name: "테크리뷰" }],
  creator: "테크리뷰",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "테크리뷰",
    title: "테크리뷰 | 최신 제품 리뷰 & 추천",
    description: "전문적인 제품 리뷰와 구매 가이드",
  },
  twitter: {
    card: "summary_large_image",
    title: "테크리뷰 | 최신 제품 리뷰 & 추천",
    description: "전문적인 제품 리뷰와 구매 가이드",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
