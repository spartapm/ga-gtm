"use client";

import Link from "next/link";
import { useState } from "react";

/** GA4 이벤트 전송 헬퍼 (gtag 직접 연동) */
function trackEvent(payload: { event: string } & Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const { event, ...params } = payload;
  window.gtag?.("event", event, params);
  console.log("[GA4 event]", event, params);
}

export default function CheckoutPage() {
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // begin_checkout: 결제 시작
  const handleBeginCheckout = () => {
    setCheckoutStarted(true);
    trackEvent({
      event: "begin_checkout",
      product_name: "테스트 맨투맨",
      price: 49000,
      currency: "KRW",
    });
  };

  // purchase: 결제 완료(API 완료 기준)
  const handlePurchase = () => {
    if (purchasing) return;
    setPurchasing(true);
    setPurchased(false);
    setTimeout(() => {
      setPurchasing(false);
      setPurchased(true);
      trackEvent({
        event: "purchase",
        transaction_id: `T-${Date.now()}`,
        product_name: "테스트 맨투맨",
        price: 49000,
        currency: "KRW",
      });
    }, 500);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-10 text-center">
        <p className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          두 번째 페이지 · /checkout
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          🧾 주문 / 결제
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          이 페이지에 진입하면 GA4에 <code>/checkout</code> 경로의 page_view가
          별도로 수집됩니다.
        </p>
      </header>

      {/* 주문 요약 */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-800">주문 상품</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-3xl">
            👕
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">테스트 맨투맨</p>
            <p className="text-sm text-slate-500">수량 1개</p>
          </div>
          <p className="text-lg font-bold text-slate-900">49,000원</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">총 결제 금액</span>
          <span className="text-xl font-bold text-indigo-600">49,000원</span>
        </div>
      </section>

      {/* 결제 시작 */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-slate-800">1단계. 결제 시작</h2>
        <p className="mb-4 text-sm text-slate-500">
          버튼 클릭 시 <code>begin_checkout</code> 이벤트가 전송됩니다.
        </p>
        <button
          onClick={handleBeginCheckout}
          className="rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white shadow transition hover:bg-slate-900 active:scale-95"
        >
          🛒 결제 진행하기
        </button>
        {checkoutStarted && (
          <p className="mt-3 text-xs font-medium text-emerald-600">
            결제 단계로 진입했습니다! (begin_checkout 전송됨)
          </p>
        )}
      </section>

      {/* 결제 완료 */}
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-slate-800">2단계. 결제 완료</h2>
        <p className="mb-6 text-sm text-slate-500">
          0.5초 로딩 후 <code>purchase</code> 전환 이벤트가 전송됩니다.
        </p>
        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {purchasing ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              결제 처리 중...
            </>
          ) : (
            "💳 결제하기"
          )}
        </button>
        {purchased && (
          <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-indigo-700">
            <p className="text-lg font-bold">🎉 결제 완료!</p>
            <p className="mt-1 text-sm">주문이 정상 처리되었습니다. (purchase 전송됨)</p>
          </div>
        )}
      </section>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← 쇼핑몰 홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
