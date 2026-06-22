"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_MEASUREMENT_ID = "G-9PME8XLFFL";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * App Router의 클라이언트 사이드 라우팅에서는 페이지 이동 시 gtag가
 * 자동으로 page_view를 보내지 않는다. 라우트 변경을 감지해 직접 전송한다.
 * (최초 로드 시에는 layout의 gtag config가 이미 page_view를 보내므로 1회 건너뜀)
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    // 최초 로드의 중복 page_view 방지
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_MEASUREMENT_ID,
    });
    console.log("[GA4 page_view]", pagePath);
  }, [pathname, searchParams]);

  return null;
}
