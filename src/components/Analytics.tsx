"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/**
 * App Router의 클라이언트 사이드 라우팅에서는 GTM이 페이지 이동을
 * 자동으로 page_view로 잡지 못한다(초기 로드만 All Pages로 잡힘).
 * 라우트 변경을 감지해 dataLayer에 커스텀 이벤트를 push하면,
 * GTM에서 '맞춤 이벤트(spa_page_view)' 트리거 → GA4 page_view 태그로 처리할 수 있다.
 *
 * (초기 로드는 GTM의 GA4 설정 태그가 All Pages로 이미 page_view를 보내므로 1회 건너뜀)
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 최초 로드의 중복 page_view 방지 (GA4 설정 태그가 이미 전송)
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "spa_page_view",
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
    console.log("[dataLayer push] spa_page_view", pagePath);
  }, [pathname, searchParams]);

  return null;
}
