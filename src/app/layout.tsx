import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import Analytics from "@/components/Analytics";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GA4 / GTM 이벤트 실습 쇼핑몰",
  description: "GA4 및 GTM 이벤트 수집 실습용 단일 페이지 데모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* dataLayer 전역 초기화: gtag 로드 전에 실행되도록 보장 */}
        <Script id="datalayer-init" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>

        {/* Google tag (gtag.js) - GA4 직접 연동 (GTM 미사용) */}
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-CFD7BKBP56"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CFD7BKBP56');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* 라우트 변경 시 GA4 page_view 전송 */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <Nav />
        {children}
      </body>
    </html>
  );
}
