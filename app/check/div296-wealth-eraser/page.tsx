import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Div296WealthEraserCalculator from "./Div296WealthEraserCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Div 296 Wealth Eraser — June 30 Cost-Base Reset Calculator | SuperTaxCheck",
  description:
    "SMSF (Self-Managed Super Fund) trustees have a single, one-time opportunity to reset their cost base before 30 June 2026. The election is irrevocable and all-or-nothing. Find out what it costs you to do nothing. Built on Division 296 Act s.42, enacted 10 March 2026.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/div296-wealth-eraser",
  },
  openGraph: {
    title: "Div 296 Wealth Eraser — June 30 Cost-Base Reset Calculator",
    description: "Find out what it costs you to do nothing. Before June 30. Free calculator built on Division 296 Act s.42, enacted 10 March 2026.",
    url: "https://supertaxcheck.com.au/check/div296-wealth-eraser",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

const thresholds = {
  tier1Balance: "$3,000,000",
  tier2Balance: "$10,000,000",
  tier1Rate: "30%",
  tier2Rate: "40%",
  enacted: "10 March 2026",
  valuationDate: "30 June 2026",
  commencement: "1 July 2026",
  indexation1: "$150,000",
  indexation2: "$500,000",
};

// Worked example for GEO extraction
const workedExample = {
  balance: "$4,500,000",
  costBase: "$800,000",
  marketValue: "$2,400,000",
  gain: "$1,600,000",
  proportion: "33.3%",
  saving: "$80,000",
  withoutReset: "When this asset is eventually sold, without the reset, approximately $80,000 in additional Div 296 tax would be payable on the pre-2026 gain.",
};

const faqs = [
  {
    question: "What is the Division 296 cost-base reset election?",
    answer: "SMSF (Self-Managed Super Fund) trustees can make a one-time, irrevocable election to reset the notional cost base of all fund assets to their market value as at 30 June 2026. This protects all pre-2026 capital gains from Division 296 tax permanently. The election is all-or-nothing — you cannot choose individual assets. Source: Division 296 Act s.42, enacted 10 March 2026.",
  },
  {
    question: "Why does June 30 2026 matter for the cost-base reset?",
    answer: "June 30 2026 is the valuation date. Assets must be independently valued at market price on this exact date for the election to be valid. Missing this date permanently extinguishes the right to make the election. The election form is lodged with the 2026-27 SMSF annual return, but the valuation must be locked on June 30. Most advice incorrectly states the deadline is when the tax return is due.",
  },
  {
    question: "Can I choose which assets to include in the cost-base reset?",
    answer: "No. This is one of the most common misconceptions about the Division 296 cost-base reset. The election applies at the fund level — every asset resets, including those in a loss position. You cannot select individual assets. This all-or-nothing nature makes the decision more complex than it first appears.",
  },
  {
    question: "What if my SMSF holds assets worth less than I paid for them?",
    answer: "If your SMSF (Self-Managed Super Fund) holds any asset currently worth less than its original purchase price, that cost base also resets to the lower market value under the election. This means opting in is not always beneficial. Any fund with loss-position assets must model the impact carefully before making the irrevocable election.",
  },
  {
    question: "Does the cost-base reset affect normal SMSF tax or CGT?",
    answer: "No. The reset is for Division 296 purposes only. It does not affect the fund's normal income tax, CGT calculations, or CGT discount eligibility. The fund will maintain two separate cost bases — one for normal SMSF tax and one for Division 296 — which must be retained for 5 years.",
  },
  {
    question: "Who can make the cost-base reset election?",
    answer: "The election is available to SMSFs (Self-Managed Super Funds) and small APRA funds only. It is not available for industry funds or retail super funds. Any SMSF can opt in — even if no member currently exceeds $3M — if members expect to exceed the threshold in future and the fund has already accrued large gains.",
  },
];

const aiDriftErrors = [
  { wrong: '"You can choose which assets to reset"', correct: "All-or-nothing at fund level. Every asset resets — including those in a loss position.", ref: "Div 296 Act s.42" },
  { wrong: '"The deadline is when your tax return is due"', correct: "June 30 2026 is the valuation date. Assets must be independently valued on this exact date. Missing it permanently extinguishes the right.", ref: "Div 296 Act s.42" },
  { wrong: '"The reset triggers a CGT event"', correct: "The reset does not trigger a CGT event and does not restart the 12-month clock for CGT discount eligibility.", ref: "Division 296 Act s.42" },
  { wrong: '"Only large funds need to worry about this"', correct: "Any SMSF can opt in — even with no members currently above $3M — if the fund holds assets with large accrued gains.", ref: "Division 296 Act s.42" },
];

export default function Div296WealthEraserPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Division 296 Cost-Base Reset Rules 2026",
    description: "Machine-readable Division 296 cost-base reset election rules for SMSFs as enacted 10 March 2026.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck", url: "https://supertaxcheck.com.au" },
    temporalCoverage: "2026-07-01/..",
    keywords: ["Division 296", "cost base reset", "SMSF", "June 30 2026", "Div 296 Wealth Eraser"],
    dateModified: "2026-04-13",
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Div 296 Wealth Eraser — June 30 Cost-Base Reset Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/div296-wealth-eraser",
    description: "Free calculator that estimates Division 296 tax savings from the SMSF cost-base reset election, based on Division 296 Act s.42 enacted 10 March 2026.",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    offers: [
      { "@type": "Offer", price: "67", priceCurrency: "AUD", name: "Div 296 Decision Pack" },
      { "@type": "Offer", price: "147", priceCurrency: "AUD", name: "Div 296 Election Pack" },
    ],
  };

  // GAP 1: Live countdown — server-side, accurate on every request
  const { days, pct } = getCountdownData();

  // GAP 4: HowTo schema
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to calculate your Division 296 cost-base reset saving",
    description: "Use the Div 296 Wealth Eraser to estimate how much Div 296 tax you can protect before the June 30 2026 valuation deadline.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter your total super balance",
        text: "Add up all your super accounts across all funds. Include both accumulation and pension phase balances.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter the original cost of your main SMSF asset",
        text: "The original purchase price your SMSF paid for its main investment — property, shares, or other asset.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Enter the estimated June 30 2026 market value",
        text: "Your best estimate of what that asset is worth today at 30 June 2026 market value.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review your personalised result",
        text: "See your pre-2026 gain at risk, your estimated avoidable Div 296 tax, and whether the Decision Pack ($67) or Election Pack ($147) applies to your situation.",
        position: 4,
      },
      {
        "@type": "HowToStep",
        name: "Answer five quick questions",
        text: "Your answers personalise which documents you receive — including whether a valuation is arranged, whether you have loss-position assets, and whether you are still deciding or ready to lodge.",
        position: 5,
      },
    ],
    supply: [
      { "@type": "HowToSupply", name: "SMSF asset purchase records" },
      { "@type": "HowToSupply", name: "Total super balance across all funds" },
      { "@type": "HowToSupply", name: "Current market value estimate for main SMSF asset" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Div 296 Wealth Eraser — free calculator" },
    ],
  };

  return (
    <>
      <Script id="jsonld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="jsonld-dataset" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <Script id="jsonld-webapp" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <Script id="jsonld-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <div className="min-h-screen bg-white font-sans">

        {/* NAV */}
        <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
            <Link href="/" className="font-serif text-lg font-bold text-neutral-950">SuperTaxCheck</Link>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-xs font-bold text-red-600">Gate 01 · Div 296 Wealth Eraser</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12">

          {/* ── HERO ── */}
          <section className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-700">
                  Div 296 Wealth Eraser · Gate 01 · Urgent
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Find out what it costs you to do nothing.{" "}
              <span className="font-light text-neutral-400">Before June 30.</span>
            </h1>

            {/* GAP 8: Sharper answer-first paragraph — BLUF structure for AI extraction */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">Division 296 tax — enacted 10 March 2026 — adds a 30% effective tax rate on SMSF earnings above $3 million from 1 July 2026.</strong>{" "}
              SMSF (Self-Managed Super Fund) trustees have until{" "}
              <strong className="text-neutral-950">30 June 2026</strong> to make a one-time, irrevocable election
              to reset the cost base of all fund assets to their current market value — protecting all pre-2026
              capital gains from Division 296 tax permanently. The election is{" "}
              <strong className="text-neutral-950">all-or-nothing</strong> at fund level. Individual assets cannot
              be selected.{" "}
              <span className="font-mono text-sm text-neutral-400">
                Source: Division 296 Act s.42, enacted 10 March 2026.
              </span>
            </p>

            {/* AI drift warning */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700">What AI gets wrong about this</p>
              <p className="mt-1 text-sm text-amber-900">
                Most AI tools state you can select individual assets for the reset.{" "}
                <strong>You cannot.</strong> The election applies at fund level — every asset resets including those in a loss position. This calculator applies the enacted March 2026 law.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <Div296WealthEraserCalculator />

              {/* RIGHT: Source + facts */}
              <div className="space-y-4">

                {/* Deadline — GAP 1: Live server-side countdown */}
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-red-600">June 30 valuation date</p>
                  <p className="mt-2 font-serif text-5xl font-bold text-red-700">{days}</p>
                  <p className="font-mono text-xs text-red-500">days remaining</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-red-200">
                    <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-red-400">{pct}% of the window has closed</p>
                  <p className="mt-2 text-xs leading-relaxed text-red-700">
                    SMSF assets must be independently valued on this exact date. Missing it permanently extinguishes the right.
                  </p>
                </div>

                {/* What you get */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Two products — one decision</p>
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Div 296 Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">Should I elect? And if so, how?</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Your personal decision model", "All-or-nothing risk assessment", "June 30 valuation checklist", "Director Minute template", "Accountant briefing document", "Loss-position asset guide"].map((i) => (
                        <li key={i} className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{i}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Div 296 Election Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">I'm electing. Give me everything to lodge.</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Everything in Decision Pack", "ATO Approved Form Template", "Trustee Resolution document", "Asset Valuation Record template", "Two-Cost-Base Record System"].map((i) => (
                        <li key={i} className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0 text-blue-500">✓</span>{i}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Law + dataset link */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-3">Legislative basis</p>
                  <div className="space-y-1 text-sm text-blue-900">
                    <p><strong>Division 296 Act s.42</strong></p>
                    <p>Enacted: {thresholds.enacted}</p>
                    <p>Commencement: {thresholds.commencement}</p>
                    <p>Valuation date: {thresholds.valuationDate}</p>
                  </div>
                  <a
                    href="/api/rules/div296.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:text-blue-800 transition underline"
                  >
                    View machine-readable rules dataset →
                  </a>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Disclaimer</p>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    Decision-support tool based on Division 296 Act s.42 enacted 10 March 2026. Not financial, legal, or tax advice. The election is irrevocable. Engage a qualified SMSF specialist before lodging.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── THRESHOLD TABLE ── */}
          <section className="mb-12">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-1">
                Division 296 thresholds — enacted {thresholds.enacted}
              </p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
                How Division 296 calculates your tax
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Tier 1 threshold", value: thresholds.tier1Balance, sub: `${thresholds.tier1Rate} effective rate on earnings above this`, "data-threshold": "3000000" },
                  { label: "Tier 2 threshold", value: thresholds.tier2Balance, sub: `${thresholds.tier2Rate} effective rate on earnings above this`, "data-threshold": "10000000" },
                  { label: "Valuation date", value: thresholds.valuationDate, sub: "SMSF assets must be independently valued at market price on this date" },
                  { label: "Indexation", value: thresholds.indexation1 + " steps", sub: `$3M threshold indexed in ${thresholds.indexation1} increments · $10M in ${thresholds.indexation2} increments` },
                ].map((t) => (
                  <div key={t.label} className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{t.label}</p>
                    <p className="mt-1 font-serif text-xl font-bold text-neutral-950">{t.value}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{t.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── WORKED EXAMPLE — GEO gold ── */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
              Worked example: how the saving is calculated
            </h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500 mb-4">
                An SMSF (Self-Managed Super Fund) with a total balance of {workedExample.balance} holds a property
                purchased in 2010 for {workedExample.costBase}, now worth {workedExample.marketValue}.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Pre-2026 gain", value: workedExample.gain, sub: `${workedExample.marketValue} − ${workedExample.costBase}` },
                  { label: "Proportion above $3M", value: workedExample.proportion, sub: `(${workedExample.balance} − $3M) ÷ ${workedExample.balance}` },
                  { label: "Estimated Div 296 saving", value: workedExample.saving, sub: "Gain × 15% × proportion", highlight: true },
                ].map((row) => (
                  <div key={row.label} className={`rounded-xl border px-4 py-3 ${row.highlight ? "border-emerald-200 bg-emerald-50" : "border-neutral-100 bg-neutral-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{row.label}</p>
                    <p className={`mt-1 font-serif text-xl font-bold ${row.highlight ? "text-emerald-700" : "text-neutral-950"}`}>{row.value}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-neutral-400">{row.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-800">
                  <strong>Without the reset:</strong> {workedExample.withoutReset}
                </p>
              </div>
              <p className="mt-3 font-mono text-[10px] text-neutral-400">
                Source: Division 296 Act s.42, enacted 10 March 2026 · Last verified: {lastVerified}
              </p>
            </div>
          </section>

          {/* ── AI DRIFT ── */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
              What AI gets wrong about the Division 296 cost-base reset
            </h2>
            <div className="space-y-4">
              {aiDriftErrors.map((item) => (
                <div key={item.wrong} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">Most AI says</p>
                      <p className="text-sm italic text-neutral-500">{item.wrong}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Enacted law says</p>
                      <p className="text-sm text-neutral-800">{item.correct}</p>
                      <p className="mt-1 font-mono text-[10px] text-neutral-400">{item.ref}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              Division 296 cost-base reset — common questions
            </h2>
            <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-4 text-left list-none">
                    <span className="text-sm font-semibold text-neutral-900">{faq.question}</span>
                    <span className="mt-0.5 shrink-0 font-mono text-neutral-400 group-open:hidden">+</span>
                    <span className="mt-0.5 hidden shrink-0 font-mono text-neutral-400 group-open:inline">−</span>
                  </summary>
                  <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                    <p className="text-sm leading-relaxed text-neutral-700">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── LAW BAR ── */}
          <section>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-blue-600">Legislative source verification</p>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-blue-900">
                    All calculations derived from the Treasury Laws Amendment (Building a Stronger and Fairer Super System) Act as enacted <strong>10 March 2026</strong>, cross-referenced with ATO primary guidance. Last verified: {lastVerified}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Div 296", "s.42", "SMSF", "CGT Reset", "ATO PCG 2026"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources — verified against original legislation</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Better Targeted Super Concessions (official)", href: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" },
                    { label: "ATO — SMSF Newsroom: Division 296 is now law", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law" },
                    { label: "Treasury Laws Amendment Act 2026 — full text", href: "https://www.legislation.gov.au/latest/C2026A00013" },
                  ].map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">
                      {s.label} ↗
                    </a>
                  ))}
                </div>
                <p className="font-mono text-[10px] text-blue-500">
                  Note: Some advice published before 10 March 2026 describes Division 296 as taxing unrealised gains. The enacted law taxes only realised earnings. Verified against: <a href="https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">ATO — Better Targeted Super Concessions ↗</a>, enacted 10 March 2026.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-neutral-200 bg-white mt-16">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
            <Link href="/" className="font-serif font-bold text-neutral-950">SuperTaxCheck</Link>
            <div className="flex gap-5">
              {[
                { label: "All tools", href: "/" },
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Contact", href: "mailto:hello@supertaxcheck.com.au" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="font-mono text-xs text-neutral-400 transition hover:text-neutral-700">{link.label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
