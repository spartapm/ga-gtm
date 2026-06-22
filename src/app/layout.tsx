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
        {/* dataLayer 전역 초기화: GTM 로드 전에 실행되도록 보장 */}
        <Script id="datalayer-init" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>

        {/*
          GA4(측정 ID: G-CFD7BKBP56)는 GTM 컨테이너(GTM-KFF7FSW5) 안의
          'GA4 설정(Google 태그)' 태그에서 관리합니다.
          중복 집계 방지를 위해 gtag.js 직접 삽입은 두지 않습니다.
        */}

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KFF7FSW5');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* Google Tag Manager (noscript) - JS 미지원 환경 대비 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KFF7FSW5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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
