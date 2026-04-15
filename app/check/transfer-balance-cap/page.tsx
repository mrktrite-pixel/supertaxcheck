import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import TransferBalanceCapCalculator from "./TransferBalanceCapCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Transfer Balance Cap $2.1M — What Is My Personal Cap? | SuperTaxCheck",
  description:
    "The transfer balance cap rises to $2.1M from July 1, 2026. But your personal cap may not be $2.1M. If you already started a pension, your personal cap depends on your highest ever balance — and if you fully used the cap, you get zero increase. Free calculator. 2 minutes.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/transfer-balance-cap",
  },
  openGraph: {
    title: "Transfer Balance Cap $2.1M — What Is My Personal Cap?",
    description: "The cap rises to $2.1M but your personal cap may not change at all. Find out in 2 minutes. Free calculator built on ATO primary guidance.",
    url: "https://supertaxcheck.com.au/check/transfer-balance-cap",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

// ── DATA ───────────────────────────────────────────────────────────────────

const scenariosTable = [
  {
    situation: "Never started a pension",
    personalCap: "$2,100,000",
    increase: "$100,000",
    colour: "emerald",
    note: "Full new cap from July 1. Best positioned to benefit.",
  },
  {
    situation: "Partially used cap (e.g. $1.2M of $2M)",
    personalCap: "$2,040,000",
    increase: "$40,000",
    colour: "blue",
    note: "40% unused × $100,000 = $40,000 increase. Proportional.",
  },
  {
    situation: "Fully used $2M cap",
    personalCap: "$2,000,000",
    increase: "$0",
    colour: "red",
    note: "No indexation. Cap stays at $2M permanently.",
  },
  {
    situation: "Commuted pension — highest was $2M",
    personalCap: "$2,000,000",
    increase: "$0",
    colour: "red",
    note: "Highest ever = full cap. Commuting does not reset the clock.",
  },
];

const accountantQuestions = [
  {
    q: "What is my personal transfer balance cap from July 1, 2026 — and can you confirm it from my ATO online services?",
    why: "The ATO calculates this individually for each person based on reported Transfer Balance Account events. Your accountant can look this up in ATO online services or from your myGov. The general $2.1M cap is not your personal cap if you have already started a pension.",
  },
  {
    q: "What is the highest ever balance I have had in my pension account — and what was the general TBC when I first had that balance?",
    why: "These two numbers determine your indexation percentage. The formula: unused cap % = 1 minus (highest ever balance ÷ TBC at that time), rounded down to the nearest whole percent. Each whole percent of unused cap = $1,000 of indexation.",
  },
  {
    q: "Do I have super still sitting in accumulation phase that I could move into pension phase?",
    why: "If you have unused cap space, you may be able to move additional super into the tax-free pension phase. Pension phase earnings are tax-free — accumulation phase earnings are taxed at 15%. Every dollar in pension phase saves you approximately $1,050 per year per $100,000 at a 7% return.",
  },
  {
    q: "If I am about to retire — should I start my pension before or after July 1?",
    why: "If you have more than $2M in super and have not started a pension yet, starting after July 1 lets you move $2.1M into pension phase instead of $2M. That extra $100,000 in the tax-free zone saves approximately $1,050 per year at a 7% return — permanently.",
  },
  {
    q: "How does my transfer balance cap interact with Division 296 and the June 30 cost-base reset?",
    why: "Moving more super into pension phase affects your total super balance composition. If your balance is near $3M, the Div 296 rules interact with the TBC decision. And the June 30 cost-base reset on Gate 01 may also be relevant. These three decisions should be modelled together before July 1.",
  },
];

const deadlineItems = [
  {
    when: "Before July 1, 2026",
    what: "Decide whether to start pension before or after July 1",
    consequence: "If you have over $2M in super and have not yet started a pension, starting after July 1 gives you $100,000 more in the tax-free zone. But you pay 15% tax on earnings for the extra months while you wait. For most people the wait is worth it.",
    urgent: true,
  },
  {
    when: "Before June 30, 2026",
    what: "June 30 cost-base reset decision (Gate 01) — separate but related",
    consequence: "The cost-base reset on directly held SMSF assets has a June 30 hard deadline. If you are moving more into pension phase, the assets supporting that pension should also have their cost bases reviewed. These two decisions interact.",
    urgent: true,
  },
  {
    when: "From July 1, 2026",
    what: "New general TBC takes effect — $2.1M",
    consequence: "First pension commencements on or after July 1, 2026 get the full $2.1M personal cap. Proportional indexation applies to existing pensions based on unused cap space.",
    urgent: false,
  },
  {
    when: "Ongoing",
    what: "Check myGov — your personal TBC is tracked by the ATO in real time",
    consequence: "Every pension commencement, commutation, or other Transfer Balance Account event is reportable. Your personal TBC and available cap space are visible in ATO online services through myGov. Check it before making any pension decisions.",
    urgent: false,
  },
  {
    when: "Within 28 days of quarter end",
    what: "TBAR — SMSF Transfer Balance Account Report",
    consequence: "For SMSFs, pension commencements, commutations, and other TBC events must be reported to the ATO via TBAR within 28 days of the end of the relevant quarter. Missing this causes your ATO records to lag — which can create incorrect cap calculations.",
    urgent: false,
  },
];

const faqs = [
  {
    question: "The transfer balance cap is going up to $2.1M. Does that mean I can put more into pension phase?",
    answer: "Maybe — and that is the key word. If you have never started a pension, yes — you get the full $2.1M cap from July 1. If you have already started a pension, your personal cap depends on how much of the old cap you used. If you fully used the $2M cap, your personal cap stays at $2M — you get zero increase. If you partially used the cap, you get a proportional increase. The general cap rising to $2.1M does not automatically mean everyone gets $2.1M. Check myGov or ask your accountant. Source: ATO.gov.au — General TBC Indexation July 2026.",
  },
  {
    question: "I used my full cap when I started my pension. Do I get the $100,000 increase?",
    answer: "No — and this is the most common misunderstanding about TBC indexation. If your highest ever pension balance was equal to your personal cap (meaning you fully used it), your unused cap percentage is 0%. Zero percent of $100,000 = $0 increase. Your personal cap stays at $2M permanently — regardless of how much the general cap increases in future. This applies whether you still have your pension running or have since commuted it. The highest ever balance is what counts. Source: ATO.gov.au — Calculating your personal TBC.",
  },
  {
    question: "I commuted my pension — does my cap reset?",
    answer: "No. Commuting a pension (moving it back to accumulation) creates a debit in your Transfer Balance Account, which can free up cap space for a new pension. But it does not reset your highest ever balance for indexation purposes. Example from the ATO: Simon started a $2M pension, fully using his cap. He commuted the full pension on June 30, 2026. His TBA balance is now zero. But his highest ever balance was $2M — equal to his cap. He gets no indexation. His personal cap stays at $2M. He cannot start a new $2.1M pension. Source: ATO.gov.au — Simon example.",
  },
  {
    question: "How is my personal cap actually calculated?",
    answer: "The ATO uses this formula: unused cap percentage = 1 minus (your highest ever TBA balance ÷ your TBC on the date of that balance), rounded DOWN to the nearest whole percent. Then: indexation increase = unused cap % × $100,000. Example: highest ever balance was $1M when the cap was $2M. Unused % = 1 - (1M ÷ 2M) = 50%. Rounded down = 50%. Indexation = 50% × $100,000 = $50,000. New personal TBC = $2M + $50,000 = $2,050,000. ATO confirms this with the Leanne example. Source: ATO.gov.au — Calculating your personal TBC.",
  },
  {
    question: "Should I start my pension before or after July 1?",
    answer: "If you have more than $2M in super and have not yet started a pension, starting after July 1 lets you move $2.1M into pension phase (tax-free earnings) rather than $2M. The extra $100,000 in pension phase saves approximately $1,050 per year in tax at 7% earnings — permanently. The cost is paying 15% tax on your full fund's earnings for the extra months you wait. For most people close to retirement, the wait pays off — but it depends on your specific balance and timing. Get advice before deciding. Source: Accurium, Fitzpatricks Advice Partners, April 2026.",
  },
  {
    question: "What is the transfer balance cap and why does it exist?",
    answer: "The transfer balance cap is the limit on how much super you can move into the retirement phase — where investment earnings are completely tax-free. It was introduced in 2017 to limit the tax concession for very high balances in pension phase. The cap started at $1.6M in 2017, increased to $1.7M in 2021, $1.9M in 2023, $2M in 2025, and $2.1M from July 1, 2026. It is indexed to CPI in $100,000 increments. Each person has their own personal cap depending on when they started their pension and how much of the cap they have used.",
  },
  {
    question: "My partner is receiving a death benefit pension from me — how does that affect their TBC?",
    answer: "A reversionary death benefit pension — one that automatically continues to the surviving spouse when the pensioner dies — creates a credit in the recipient's Transfer Balance Account 12 months after the date of death. This credit is valued at the pension's balance 12 months after death, not at the date of death. This 12-month delay gives the surviving spouse time to plan. A non-reversionary death benefit pension creates a credit immediately when the new pension starts. Either way, the surviving spouse must ensure the credit does not push them over their personal TBC. If it does, they must commute the excess and may face excess transfer balance tax. Source: ATO.gov.au — death benefit income streams.",
  },
  {
    question: "I have super in both accumulation and pension phase. How much can I still move across?",
    answer: "The amount you can move from accumulation to pension phase is limited by your remaining personal TBC space. Remaining space = your personal TBC minus your current Transfer Balance Account balance. If your personal TBC from July 1 is $2,050,000 and your current pension value is $1,200,000, you have $850,000 of remaining cap space. You can move up to $850,000 from accumulation into pension phase. Every dollar you move saves 15% tax on earnings — at 7% return that is $1,050 per year per $100,000 moved. Source: ATO.gov.au.",
  },
  {
    question: "Does investment growth in my pension count against the transfer balance cap?",
    answer: "No — and this is important. Investment growth in a pension account does not count against the TBC. Your TBC tracks the amount you transferred IN to start or top up the pension (credits) minus the amount you commuted out (debits). Pension payments you receive also do not affect your TBC. So if you move $2.1M into pension phase and it grows to $3M — you have not breached your cap. The cap only applies at the point of transferring money in. Source: ATO.gov.au — transfer balance cap rules.",
  },
  {
    question: "How do I check my personal TBC?",
    answer: "Log into myGov → ATO online services → Super → Transfer balance cap. The ATO calculates your personal TBC based on all events reported by your super fund in your Transfer Balance Account. For SMSFs, this depends on your fund lodging Transfer Balance Account Reports (TBARs) on time — within 28 days of the end of each quarter. If your SMSF has not reported correctly, your myGov figure may be wrong. Ask your accountant to check the ATO portal directly and confirm all events have been reported.",
  },
];

const aiErrors = [
  {
    wrong: '"The transfer balance cap rises to $2.1M from July 1 — everyone gets the higher cap"',
    correct: "Your personal cap depends on how much of the previous cap you used. If you fully used the $2M cap — your personal cap stays at $2M. If you partially used it, you get a proportional increase. If you never started a pension, you get the full $2.1M. Not everyone benefits equally.",
    ref: "ATO.gov.au — General TBC indexation July 2026 (official)",
  },
  {
    wrong: '"I commuted my pension so I get a fresh $2.1M cap"',
    correct: "Commuting a pension frees up cap space for a new pension — but it does not reset the highest ever balance used for indexation. If you fully used your cap before commuting, your personal cap stays at $2M. The ATO confirms this in the Simon example: commuting the full pension does not entitle Simon to the $2.1M cap.",
    ref: "ATO.gov.au — Calculating your personal TBC — Simon example",
  },
  {
    wrong: '"Investment growth in my pension has pushed me over the cap — I need to fix this"',
    correct: "Investment growth inside a pension does not count against the transfer balance cap. Only the amounts you transfer IN create credits. Your pension growing from $2M to $2.5M is not a TBC breach. You only breach the cap if you transfer in more than your personal cap limit at the point of commencement.",
    ref: "ATO.gov.au — transfer balance cap rules",
  },
  {
    wrong: '"Start your pension now to secure the tax-free earnings — timing does not matter"',
    correct: "Timing matters significantly if you are about to retire with more than $2M in super. Starting after July 1, 2026 means you can move $2.1M into pension phase — $100,000 more than before July 1. That extra $100,000 in tax-free earnings saves approximately $1,050 per year at 7% return. For people retiring near July 1, the wait is usually worth it.",
    ref: "Accurium, Fitzpatricks Advice Partners — April 2026",
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function TransferBalanceCapPage() {
  const { days } = getCountdownData();

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
    name: "Transfer Balance Cap Personal Indexation Rules 2026",
    description: "Machine-readable transfer balance cap indexation rules from July 1 2026. General TBC: $2.1M. Personal TBC = proportional based on unused cap %. Fully used cap: stays at $2M. Never started: $2.1M. Formula: unused % × $100,000 increment, rounded down to nearest whole percent. Source: ATO.gov.au.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    dateModified: "2026-04-15",
    keywords: ["transfer balance cap", "$2.1 million", "personal TBC", "proportional indexation", "pension phase", "retirement super", "July 2026"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Transfer Balance Cap Optimiser",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/transfer-balance-cap",
    description: "Free calculator showing your personal transfer balance cap from July 1 2026, indexation increase, unused cap space, and tax saving from moving more into pension phase.",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    offers: [
      { "@type": "Offer", price: "67", priceCurrency: "AUD", name: "Transfer Balance Cap Decision Pack" },
      { "@type": "Offer", price: "147", priceCurrency: "AUD", name: "Transfer Balance Cap Planning Pack" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to calculate your personal transfer balance cap from July 1 2026",
    description: "Free 2-minute calculator showing your personal TBC, indexation increase, unused cap space, and annual tax saving from moving more into pension phase.",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Select your pension status", text: "Whether you have never started a pension, have a pension running, fully used your cap, or commuted a prior pension.", position: 1 },
      { "@type": "HowToStep", name: "Enter your highest ever pension balance", text: "The maximum amount ever in your pension phase at any one time — not the current balance.", position: 2 },
      { "@type": "HowToStep", name: "Select the TBC when you first started", text: "The general TBC on the date you first had your highest balance determines your personal cap.", position: 3 },
      { "@type": "HowToStep", name: "See your result", text: "Your personal TBC from July 1, indexation increase, unused cap space, and annual tax saving.", position: 4 },
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
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span className="font-mono text-xs font-bold text-purple-600">Transfer Balance Cap Optimiser</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">

          {/* ── SECTION 1: HERO ── */}
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-purple-700">
                  Transfer Balance Cap Optimiser · July 1 Opportunity
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              The pension cap rises to $2.1M from July 1.{" "}
              <span className="font-light text-neutral-400">But your personal cap may not change at all.</span>
            </h1>

            {/* Accountant moment */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Most people hear "$2.1M cap" and assume they benefit. Many do not.
              </p>
              <p className="text-sm text-amber-800">
                The general cap rises to $2.1M. But your personal cap depends on how much of the previous cap you used when you started your pension. If you fully used the $2M cap, your personal cap stays at $2M — zero increase. The free calculator below shows your exact personal cap in 2 minutes.
              </p>
            </div>

            {/* The trap */}
            <div className="mt-4 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-700 mb-2">The trap most people miss</p>
              <div className="space-y-1.5 text-sm text-red-900">
                <p><strong>Fully used cap:</strong> If your highest ever pension balance equalled your cap, you get $0 indexation. Your personal cap stays at $2M. Not $2.1M.</p>
                <p><strong>Commuted pension trap:</strong> Commuting a pension frees up cap space for a new pension — but does NOT reset the highest ever balance for indexation. Confirmed by the ATO.</p>
              </div>
            </div>

            {/* BLUF */}
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">From July 1, moving super into pension phase means earnings on that money are completely tax-free.</strong>{" "}
              Every $100,000 in pension phase instead of accumulation saves approximately{" "}
              <strong className="text-neutral-950">$1,050 per year</strong> in tax at a 7% return.{" "}
              If you have unused cap space — or if you are about to retire for the first time — knowing your exact personal cap before July 1 can make a material difference.{" "}
              <span className="font-mono text-sm text-neutral-400">Source: ATO.gov.au, Accurium, April 2026.</span>
            </p>

            {/* Mobile CTA */}
            <div className="mt-5 sm:hidden">
              <a href="#calculator" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800">
                ↓ Find my personal cap — 2 minutes
              </a>
            </div>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <TransferBalanceCapCalculator />

              {/* RIGHT: Sidebar */}
              <div className="space-y-4">

                {/* Quick reference */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Who gets what from July 1</p>
                  <div className="space-y-2">
                    {[
                      { label: "Never started a pension", cap: "$2,100,000", colour: "emerald" },
                      { label: "Partially used cap", cap: "Proportional", colour: "blue" },
                      { label: "Fully used $2M cap", cap: "$2,000,000", colour: "red" },
                      { label: "Commuted — highest was $2M", cap: "$2,000,000", colour: "red" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <p className="text-xs text-neutral-700">{row.label}</p>
                        <p className={`font-mono text-xs font-bold ml-2 shrink-0 ${row.colour === "emerald" ? "text-emerald-700" : row.colour === "blue" ? "text-blue-700" : "text-red-700"}`}>{row.cap}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-400">Source: ATO.gov.au · {lastVerified}</p>
                </div>

                {/* Countdown */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">June 30 cost-base reset</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-white">{days}</span>
                    <span className="font-mono text-xs text-neutral-400">days to June 30</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">TBC decision interacts with the Gate 01 cost-base reset — both need attention before July 1.</p>
                  <Link href="/check/div296-wealth-eraser" className="mt-3 inline-flex font-mono text-[10px] text-blue-400 hover:text-blue-300 transition underline">
                    Run the June 30 calculator →
                  </Link>
                </div>

                {/* Two packs */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Two packs. One cap.</p>
                  <div className="mb-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">What is my personal cap and what space do I have?</p>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Planning Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">I have unused space — give me the timing plan.</p>
                  </div>
                </div>

                {/* Legal */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Primary sources</p>
                  <div className="space-y-1">
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/retirement-withdrawal-lump-sum-or-income-stream/calculating-your-personal-transfer-balance-cap" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Calculating your personal TBC ↗</a>
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/general-transfer-balance-cap-indexation-on-1-july-2026" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — TBC indexation July 2026 ↗</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── INLINE CTA ── */}
          <div className="flex justify-center">
            <a href="#calculator" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50">
              ↓ Find my personal cap — 2 minutes
            </a>
          </div>

          {/* ── SECTION 2: PLAIN ENGLISH TRANSLATION ── */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Plain English — what this means for you</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
                Here is the pension cap explained — without the jargon.
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-neutral-700">
                <p>
                  <strong className="text-neutral-950">Gary is 67 and retired.</strong> He has $2.3 million in his super fund. He started a pension 18 months ago — moved $1.8 million into pension phase and left $500,000 in accumulation. The $1.8M in pension earns with zero tax. The $500,000 in accumulation earns with 15% tax on the earnings.
                </p>
                <p>
                  Gary hears that the transfer balance cap is going up to $2.1M from July 1. He thinks this means he can now move more of his $500,000 into pension phase. Is he right?
                </p>
                <p>
                  <strong className="text-neutral-950">Partly.</strong> Here is how the ATO works it out. Gary's highest ever pension balance was $1.8M. His cap when he started was $2M. So his unused percentage is: 1 minus ($1.8M ÷ $2M) = 10%. Rounded down = 10%. His indexation increase = 10% × $100,000 = $10,000.
                </p>
                <p>
                  Gary's new personal cap = $2M + $10,000 = $2,010,000. Not $2.1M. Just $2.01M. He can move an extra $210,000 from accumulation into pension phase — not $300,000.
                </p>
                <p>
                  <strong className="text-neutral-950">If Gary had fully used his cap</strong> — say he moved $2M into pension when the cap was $2M — he gets zero indexation. His cap stays at $2M. He can only move super into pension phase if he commutes some of his existing pension first.
                </p>
                <p>
                  <strong className="text-neutral-950">If Gary had never started a pension</strong> — he would get the full $2.1M cap from July 1. If he has over $2.1M in super and is planning to retire, it may be worth waiting until July 1 to start his pension so he gets the higher cap.
                </p>
                <p className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                  <strong className="text-neutral-950">The bottom line:</strong> Run the calculator above. It works out your personal cap based on your highest ever pension balance and when you started. Then check the result against your myGov — the ATO tracks this for every person individually.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: SCENARIOS TABLE ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Who gets what — four scenarios</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              Your personal cap from July 1 depends on which scenario applies to you.
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="min-w-full border-separate border-spacing-0 bg-white text-left">
                <thead>
                  <tr>
                    {["Your situation", "Personal cap from July 1", "Increase", "Notes"].map((h) => (
                      <th key={h} className="border-b border-neutral-200 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenariosTable.map((row, i) => (
                    <tr key={i}>
                      <td className="border-b border-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-950">{row.situation}</td>
                      <td className={`border-b border-neutral-100 px-4 py-3 font-mono text-sm font-bold ${row.colour === "emerald" ? "text-emerald-700" : row.colour === "blue" ? "text-blue-700" : "text-red-700"}`}>{row.personalCap}</td>
                      <td className={`border-b border-neutral-100 px-4 py-3 font-mono text-sm font-bold ${row.increase === "$0" ? "text-red-600" : "text-emerald-700"}`}>{row.increase}</td>
                      <td className="border-b border-neutral-100 px-4 py-3 text-xs text-neutral-500">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[10px] text-neutral-400">Source: ATO.gov.au — Calculating your personal TBC · General TBC indexation July 2026 · {lastVerified}</p>
          </section>

          {/* ── SECTION 4: WHAT TO ASK YOUR ACCOUNTANT ── */}
          <section>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">Five questions to ask your accountant</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                Take these in before July 1.
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                The TBC decision interacts with the Div 296 cost-base reset (Gate 01) and the bring-forward contribution window (Gate 04). These five questions get your accountant working on all of them together.
              </p>
              <div className="space-y-4">
                {accountantQuestions.map((item, i) => (
                  <div key={i} className="rounded-xl border border-emerald-100 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-mono text-xs font-bold text-emerald-700">{i + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 mb-1">"{item.q}"</p>
                        <p className="text-xs text-neutral-500"><strong className="text-neutral-600">Why this matters:</strong> {item.why}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-3">
                <p className="text-xs text-emerald-900">
                  <strong>Tip:</strong> The TBC decision, the Div 296 cost-base reset, and the bring-forward contribution window all have deadlines around June 30 and July 1. Ask your accountant to look at all three together — they interact with each other and the best outcome comes from coordinated planning.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 5: DEADLINE TRACKER ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Key timing — what to do and when</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
              The TBC opportunity is at July 1 — but two decisions need attention before June 30.
            </h2>
            <div className="space-y-3">
              {deadlineItems.map((item, i) => (
                <div key={i} className={`flex gap-4 rounded-xl border p-4 ${item.urgent ? "border-purple-200 bg-purple-50" : "border-neutral-200 bg-white"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${item.urgent ? "bg-purple-100 text-purple-700" : "bg-neutral-100 text-neutral-500"}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${item.urgent ? "text-purple-600" : "text-neutral-400"}`}>{item.when}</span>
                      {item.urgent && <span className="rounded-full border border-purple-200 bg-purple-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-purple-700">Decision needed</span>}
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 mb-1">{item.what}</p>
                    <p className="text-xs text-neutral-500">{item.consequence}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 6: AI ERRORS ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">What most AI tools get wrong</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              If you Googled this or asked an AI — check these.
            </h2>
            <div className="space-y-4">
              {aiErrors.map((item, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-2">Most AI tools say</p>
                      <p className="text-sm italic text-neutral-500">{item.wrong}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-2">The actual rules say</p>
                      <p className="text-sm text-neutral-800">{item.correct}</p>
                      <p className="mt-2 font-mono text-[10px] text-neutral-400">{item.ref}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 7: FAQ ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Common questions</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              Questions people are actually asking about the transfer balance cap increase.
            </h2>
            <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-4 text-left">
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

          {/* ── SECTION 8: PLAIN ENGLISH GUIDE LINK ── */}
          <section>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Want the full picture?</p>
              <h2 className="font-serif text-2xl font-bold text-white mb-3">
                We wrote a plain English guide to the new super tax. All five tools. No jargon.
              </h2>
              <p className="text-sm text-neutral-300 mb-5">
                Covers the June 30 cost-base reset, death benefit tax, the trust exit question, the bring-forward window, and this — the transfer balance cap. Written the way a smart mate would explain it.
              </p>
              <Link href="/what-is-the-new-super-tax"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100">
                Read the plain English guide →
              </Link>
              <p className="mt-3 font-mono text-[10px] text-neutral-500">Free. No email required.</p>
            </div>
          </section>

          {/* ── CROSS-NAVIGATION ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">Also on SuperTaxCheck</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/check/div296-wealth-eraser"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">Gate 01 · {days} days</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">June 30 Cost-Base Reset</p>
                <p className="text-xs text-neutral-500">Lock in today's values before June 30. Interacts with the TBC decision.</p>
              </Link>
              <Link href="/check/death-benefit-tax-wall"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">Gate 02</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">Death Benefit Tax-Wall</p>
                <p className="text-xs text-neutral-500">What your adult kids pay when you die — and how to reduce it.</p>
              </Link>
              <Link href="/check/bring-forward-window"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Gate 04</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">Bring-Forward $390K</p>
                <p className="text-xs text-neutral-500">Up to $390,000 into super from July 1. Eligibility check in 2 minutes.</p>
              </Link>
              <Link href="/what-is-the-new-super-tax"
                className="group rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition hover:bg-neutral-900">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Plain English guide</p>
                <p className="text-sm font-semibold text-white mb-1">All five tools explained</p>
                <p className="text-xs text-neutral-400">No jargon. No email. For you — not your accountant.</p>
              </Link>
            </div>
          </section>

          {/* ── SECTION 9: LAW BAR ── */}
          <section>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-blue-600">Legislative source verification</p>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-blue-900">
                    General TBC $2.1M confirmed by ATO February 2026 following CPI December 2025 release. Proportional indexation formula verified against ATO primary guidance (examples: Nina, Leanne, Simon, Nada, Maryanne). Last verified: {lastVerified}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["TBC Rules", "ATO Confirmed", "CPI Indexed", "Feb 2026"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Calculating your personal transfer balance cap", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/retirement-withdrawal-lump-sum-or-income-stream/calculating-your-personal-transfer-balance-cap" },
                    { label: "ATO — General TBC indexation on 1 July 2026 (official)", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/general-transfer-balance-cap-indexation-on-1-july-2026" },
                    { label: "Accurium — TBC indexation from 1 July 2026", href: "https://www.accurium.com.au/blog/2026/01/transfer-balance-cap-indexation-from-1-july-2026/" },
                  ].map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* DISCLAIMER */}
          <section>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">General advice warning</p>
              <p className="text-xs leading-relaxed text-neutral-500">
                The information on this page is general in nature and does not constitute personal financial, legal, or tax advice. Personal TBC calculations are indicative only — check myGov or ask your accountant to confirm your exact position from ATO records. Always engage a qualified SMSF specialist before making pension commencement or commutation decisions.{" "}
                <Link href="/privacy" className="underline hover:text-neutral-700">Privacy</Link> ·{" "}
                <Link href="/terms" className="underline hover:text-neutral-700">Terms</Link>
              </p>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-neutral-200 bg-white mt-8">
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
