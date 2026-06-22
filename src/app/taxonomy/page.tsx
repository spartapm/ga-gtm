import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이벤트 설계서 | GA4 / GTM 데모",
  description: "이 데모가 수집하는 이벤트의 설계 의도와 트리거 정리",
};

type EventRow = {
  no: number;
  name: string;
  trigger: string;
  params: string[];
  intent: string;
  category: string;
  categoryColor: string;
};

const events: EventRow[] = [
  {
    no: 1,
    name: "coupon_click",
    trigger: '홈 화면 / "🎁 할인 쿠폰 받기" 버튼을 클릭한 순간',
    params: ["button_name"],
    category: "순수 클릭",
    categoryColor: "bg-sky-100 text-sky-700",
    intent:
      "유저의 쿠폰 반응률 확인용. 단순 텍스트 기반 클릭 수집.",
  },
  {
    no: 2,
    name: "add_to_cart",
    trigger: '홈 화면 / 상품 카드 내 "🛒 장바구니 담기" 버튼을 클릭한 순간',
    params: ["product_name", "price"],
    category: "데이터 레이어 · 클릭",
    categoryColor: "bg-indigo-100 text-indigo-700",
    intent:
      "상품명과 가격 데이터를 화면 뒤에서 정확히 낚아채기 위함.",
  },
  {
    no: 3,
    name: "sign_up_complete",
    trigger:
      "홈 화면 / 회원가입 버튼을 누르고 0.5초 후 서버에서 가입 완료 응답이 성공으로 떨어진 순간",
    params: ["user_status"],
    category: "데이터 레이어 · API 완료",
    categoryColor: "bg-emerald-100 text-emerald-700",
    intent:
      "단순 클릭이 아닌, 실제 가입 성공 유저만 필터링하여 수집 (데이터 뻥튀기 방지).",
  },
  {
    no: 4,
    name: "begin_checkout",
    trigger: '결제 페이지 / "결제 진행하기" 버튼을 클릭한 순간',
    params: ["product_name", "price", "currency"],
    category: "이탈 분석용",
    categoryColor: "bg-amber-100 text-amber-700",
    intent:
      "결제 시작 단계를 추적하여 최종 구매 성공률(Funnel)을 보기 위함.",
  },
  {
    no: 5,
    name: "purchase",
    trigger:
      '결제 페이지 / "결제하기" 버튼을 누르고 0.5초 후 최종 결제 성공 팝업이 뜨는 순간',
    params: ["transaction_id", "product_name", "price", "currency"],
    category: "매출 직결",
    categoryColor: "bg-rose-100 text-rose-700",
    intent:
      "매출 집계의 정합성을 위해 반드시 API 성공 완료 시점에 수집. 금액은 GA4 표준인 value로 매핑.",
  },
  {
    no: 6,
    name: "scroll",
    trigger: "홈 화면 / 상품 상세 설명 영역을 50%, 100% 내린 순간",
    params: ["percent_scrolled"],
    category: "콘텐츠 소비",
    categoryColor: "bg-violet-100 text-violet-700",
    intent:
      "GA4 향상된 측정(Enhanced Measurement)의 스크롤 자동 수집으로 감지(기본 90% 도달 시).",
  },
  {
    no: 7,
    name: "spa_page_view",
    trigger:
      "페이지 이동(홈 ↔ 주문/결제 ↔ 설계서) 시. SPA 라우트 변경을 감지한 순간",
    params: ["page_path", "page_location", "page_title"],
    category: "페이지뷰(SPA 보정)",
    categoryColor: "bg-slate-200 text-slate-700",
    intent:
      "SPA는 새로고침이 없어 gtag가 페이지 이동을 자동으로 못 잡으므로, 라우트 변경 시 gtag로 직접 page_view를 보정 전송.",
  },
];

export default function TaxonomyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="mb-2 inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
          내부 문서 · /taxonomy
        </p>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
          📋 앱 이벤트 설계서
          <span className="text-base font-medium text-slate-400">
            (Event Taxonomy)
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          이 데모 서비스가 수집하는 이벤트가 <strong>어떤 의도로, 언제, 어떤
          데이터와 함께</strong> 발생하도록 설계되었는지 정리한 문서입니다.
        </p>
      </header>

      {/* 데스크톱: 표 / 모바일: 가로 스크롤 */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">순번</th>
              <th className="px-4 py-3 font-semibold">
                이벤트 이름
                <span className="block font-normal normal-case">
                  (Event Name)
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">
                발생 위치 및 조건
                <span className="block font-normal normal-case">
                  (Trigger Logic)
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">
                수집 데이터
                <span className="block font-normal normal-case">
                  (Parameter)
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">
                설계 의도 및 주의사항
                <span className="block font-normal normal-case">
                  (Action-oriented)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.no}
                className="border-b border-slate-100 align-top last:border-b-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-4 font-mono text-slate-400">{e.no}</td>
                <td className="px-4 py-4">
                  <code className="rounded bg-rose-50 px-2 py-1 font-mono text-[13px] font-semibold text-rose-600">
                    {e.name}
                  </code>
                </td>
                <td className="px-4 py-4 leading-relaxed text-slate-600">
                  {e.trigger}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {e.params.map((p) => (
                      <code
                        key={p}
                        className="w-fit rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700"
                      >
                        {p}
                      </code>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 leading-relaxed text-slate-600">
                  <span
                    className={`mb-1.5 inline-block rounded px-2 py-0.5 text-xs font-semibold ${e.categoryColor}`}
                  >
                    {e.category}
                  </span>
                  <p>{e.intent}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-400">수집 방식</p>
          <p className="mt-1 text-sm text-slate-700">
            ①~⑤·⑦은 <code>gtag(&apos;event&apos;, ...)</code>로 GA4에 직접
            전송, ⑥은 GA4 향상된 측정으로 자동 수집합니다.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-400">전환 핵심</p>
          <p className="mt-1 text-sm text-slate-700">
            <code>sign_up_complete</code>·<code>purchase</code>는 클릭이 아닌{" "}
            <strong>API 성공 시점</strong>에만 수집해 데이터 정합성을
            지킵니다.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-400">GA4 매핑</p>
          <p className="mt-1 text-sm text-slate-700">
            금액 <code>price</code>는 GA4 표준 매개변수 <code>value</code>로,{" "}
            <code>currency</code>와 함께 매핑하면 매출 리포트에 잡힙니다.
          </p>
        </div>
      </section>

      <p className="mt-6 text-xs text-slate-400">
        ※ 본 데모는 GTM 없이 gtag.js로 GA4(측정 ID: G-CFD7BKBP56)에 직접
        전송합니다. 실제 전송 여부는 GA4 실시간 보고서 / DebugView에서 확인하세요.
      </p>
    </main>
  );
}
