"use client";

import { useState } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/** dataLayer 안전 push 헬퍼 (dataLayer 미초기화 상황도 방어) */
function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  // 실습 확인용 콘솔 로그
  console.log("[dataLayer push]", payload);
}

export default function Home() {
  const [couponClicked, setCouponClicked] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  // 1) 일반 클릭 트리거용: 할인 쿠폰 받기
  const handleCoupon = () => {
    setCouponClicked(true);
    pushDataLayer({
      event: "coupon_click",
      button_name: "할인 쿠폰 받기",
    });
  };

  // 2) 데이터 레이어 - 클릭 기준: 장바구니 담기
  const handleAddToCart = () => {
    setCartAdded(true);
    pushDataLayer({
      event: "add_to_cart",
      product_name: "테스트 맨투맨",
      price: 49000,
    });
  };

  // 3) 데이터 레이어 - API/완료 기준: 회원가입 완료
  const handleSignUp = () => {
    if (signupLoading) return;
    setSignupLoading(true);
    setSignupDone(false);
    setTimeout(() => {
      setSignupLoading(false);
      setSignupDone(true);
      pushDataLayer({
        event: "sign_up_complete",
        user_status: "premium_member",
      });
    }, 500);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* ====== 헤더 ====== */}
      <header className="mb-10 text-center">
        <p className="mb-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          GA4 / GTM 이벤트 실습용 데모
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          🛍️ 초간단 테스트 쇼핑몰
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          버튼 클릭과 스크롤로 dataLayer 이벤트가 어떻게 쌓이는지 확인해 보세요.
        </p>
      </header>

      {/* ====== [일반 클릭 트리거용] 히어로 배너 ====== */}
      <section className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-12 text-center text-white shadow-lg">
        <h2 className="text-2xl font-bold sm:text-3xl">
          신규 가입 회원 전원 50% 할인!
        </h2>
        <p className="mt-2 text-indigo-100">
          지금 쿠폰을 받고 첫 구매를 더 저렴하게 시작하세요.
        </p>
        <button
          onClick={handleCoupon}
          className="mt-6 rounded-xl bg-white px-8 py-4 text-lg font-bold text-indigo-700 shadow transition hover:scale-[1.02] hover:bg-indigo-50 active:scale-95"
        >
          🎁 할인 쿠폰 받기
        </button>
        {couponClicked && (
          <p className="mt-4 text-sm font-medium text-indigo-100">
            쿠폰이 발급되었습니다! (클릭 이벤트 전송됨)
          </p>
        )}
      </section>

      {/* ====== [데이터 레이어 - 클릭] 상품 카드 ====== */}
      <section className="mb-12">
        <h3 className="mb-4 text-lg font-bold text-slate-800">오늘의 추천 상품</h3>
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-5xl sm:h-32 sm:w-32">
            👕
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-slate-900">
              테스트 맨투맨
            </h4>
            <p className="mt-1 text-sm text-slate-500">
              부드러운 코튼 소재의 데일리 맨투맨 티셔츠.
            </p>
            <p className="mt-2 text-xl font-bold text-slate-900">49,000원</p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <button
              onClick={handleAddToCart}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-95"
            >
              🛒 장바구니 담기
            </button>
            {cartAdded && (
              <span className="text-xs font-medium text-emerald-600">
                장바구니에 담겼습니다!
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ====== [스크롤 깊이 트리거용] 긴 상품 상세 설명 ====== */}
      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-800">상품 상세 정보</h3>
        <div className="space-y-6 text-sm leading-7 text-slate-600">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <h4 className="mb-2 text-base font-semibold text-slate-700">
                상세 섹션 {i + 1}
              </h4>
              <p>
                이 영역은 스크롤 깊이(Scroll Depth) 트리거 테스트를 위한 더미
                콘텐츠입니다. 페이지를 천천히 아래로 내리면서 GTM의 스크롤 깊이
                트리거가 50%, 100% 지점에서 정상적으로 발동하는지 확인해 보세요.
                실제 쇼핑몰에서는 소재, 사이즈, 세탁 방법, 배송/교환 안내 등 다양한
                정보가 이 위치에 길게 배치됩니다. 충분한 길이를 확보하기 위해 동일한
                형태의 문단을 여러 번 반복해서 보여주고 있습니다.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
          💡 GTM에서 <strong>스크롤 깊이 트리거</strong>를 50%, 100%로 설정하면
          이 긴 영역을 내리는 동안 이벤트가 발생합니다.
        </p>
      </section>

      {/* ====== [데이터 레이어 - API/완료 기준] 회원가입 ====== */}
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-slate-800">
          마지막으로, 회원가입 하기
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          버튼을 누르면 0.5초간 로딩 후 가입이 완료됩니다.
        </p>

        <button
          onClick={handleSignUp}
          disabled={signupLoading}
          className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {signupLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              가입 처리 중...
            </>
          ) : (
            "⚡ 1초 만에 회원가입 완료하기"
          )}
        </button>

        {signupDone && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-700">
            <p className="text-lg font-bold">🎉 가입 완료!</p>
            <p className="mt-1 text-sm">
              프리미엄 회원이 되신 것을 환영합니다. (전환 이벤트 전송됨)
            </p>
          </div>
        )}
      </section>

      <footer className="pb-6 text-center text-xs text-slate-400">
        브라우저 콘솔과 GTM 미리보기 모드에서 dataLayer를 확인하세요.
      </footer>
    </main>
  );
}
