import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import BringForwardWindowCalculator from "./BringForwardWindowCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Bring-Forward $390K Window — Super Contribution Calculator 2026 | SuperTaxCheck",
  description:
    "From July 1, you can put up to $390,000 into super in one go — up from $360,000. But if you already triggered the bring-forward rule, you are locked out of the new cap. And unused 2020-21 carry-forward amounts expire permanently on June 30. Free eligibility check.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/bring-forward-window",
  },
  openGraph: {
    title: "Bring-Forward $390K Window — Are You Eligible?",
    description: "From July 1, eligible Australians can contribute up to $390,000 into super. But there are two traps most people miss. Free eligibility check. 2 minutes.",
    url: "https://supertaxcheck.com.au/check/bring-forward-window",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

// ── DATA ───────────────────────────────────────────────────────────────────

const eligibilityTable = [
  { tsb: "Under $1,840,000", cap: "$390,000", years: "3 years", note: "Full bring-forward available from July 1" },
  { tsb: "$1,840,000 – $1,970,000", cap: "$260,000", years: "2 years", note: "Partial bring-forward only" },
  { tsb: "$1,970,000 – $2,100,000", cap: "$130,000", years: "1 year", note: "Annual cap only — no bring-forward" },
  { tsb: "$2,100,000 or over", cap: "$0", years: "—", note: "Cannot make non-concessional contributions" },
];

const accountantQuestions = [
  {
    q: "Am I currently in a bring-forward period — and if so, how much of my $360,000 cap have I already used?",
    why: "If you triggered bring-forward in 2024-25 or 2025-26, you are locked in at $360,000 — not the new $390,000. You cannot access the higher cap until your period expires. Your accountant can check this in ATO online services.",
  },
  {
    q: "What is my total super balance going to be at June 30, 2026 — and which eligibility band does that put me in?",
    why: "The eligibility thresholds are measured at June 30, 2026 — not today. If you are close to $1.84M, $1.97M, or $2.1M, the exact balance on June 30 determines how much you can contribute. A few thousand dollars can make a material difference.",
  },
  {
    q: "Do I have any unused 2020-21 concessional contribution space — and do I need to use it before June 30?",
    why: "Unused concessional contributions from 2020-21 expire permanently on June 30, 2026. If your balance is under $500,000 and you have not used your full concessional cap every year since 2020-21, there may be space to use before it disappears forever.",
  },
  {
    q: "Should I contribute $120,000 before June 30 this year, and then trigger the full $390,000 from July 1?",
    why: "This is the optimal strategy for people who have not triggered bring-forward yet. Contributing the annual cap of $120,000 before June 30 does not trigger bring-forward. You then trigger the full $390,000 from July 1 — a total of $510,000 across two financial years.",
  },
  {
    q: "Would contributing this amount push my balance above $3 million — and does that change the decision?",
    why: "The new Division 296 tax applies to earnings above $3 million from July 1. Contributing more into super may save income tax now but increase Div 296 tax later. The two decisions interact — they should be modelled together.",
  },
];

const deadlineItems = [
  {
    when: "Right now",
    what: "Check myGov — are you in a bring-forward period?",
    consequence: "Log in to myGov → ATO → Super → Bring-forward period. This tells you whether you are locked in at $360,000 or free to access the new $390,000 cap. You need to know this before making any contribution decisions.",
    urgent: true,
  },
  {
    when: "Before June 30, 2026",
    what: "Use any 2020-21 carry-forward concessional amounts — they expire permanently",
    consequence: "Unused concessional contribution space from the 2020-21 financial year cannot be carried forward after June 30, 2026. If your balance is under $500,000 and you have unused space from that year, June 30 is the last chance. No extension. No exception.",
    urgent: true,
  },
  {
    when: "Before June 30, 2026",
    what: "Consider contributing $120,000 this year without triggering bring-forward",
    consequence: "Contributing $120,000 (the current annual NCC cap) before June 30 does not trigger bring-forward if done correctly. This lets you contribute the full $390,000 from July 1 as well — total $510,000 across two years. Get advice before acting.",
    urgent: true,
  },
  {
    when: "From July 1, 2026",
    what: "New caps take effect — $130,000 annual, $390,000 bring-forward",
    consequence: "The higher caps apply from the start of the new financial year. Eligibility is determined by your TSB at June 30, 2026 — so the June 30 balance matters even for July contributions.",
    urgent: false,
  },
  {
    when: "From July 1, 2026",
    what: "Contributions must be received by your fund — not just initiated",
    consequence: "For SMSFs, the contribution must be in the fund's bank account by the relevant date — not just transferred. For industry funds, allow several business days. Do not leave it to the last day.",
    urgent: false,
  },
];

const faqs = [
  {
    question: "What is the bring-forward rule and what is changing in July 2026?",
    answer: "The bring-forward rule lets you contribute up to three years of non-concessional (after-tax) contributions into super in a single year instead of spreading them out. Currently, you can contribute up to $360,000 in one go (three times the annual $120,000 cap). From July 1, 2026, the annual cap rises to $130,000 — so the three-year bring-forward rises to $390,000. That is an extra $30,000 you can get into the concessionally taxed super environment in one hit.",
  },
  {
    question: "I already triggered bring-forward earlier. Am I locked out of the new $390,000 cap?",
    answer: "Yes — if you triggered the bring-forward rule in 2024-25 or 2025-26, you are locked in at the cap that applied when you triggered — $360,000 over the three-year period. The new $390,000 does not apply to an existing bring-forward period. You must wait until that period expires before you can trigger again. Example: if you triggered in 2025-26, your period runs until 2027-28. You cannot access the $390,000 cap until July 2028. Source: Challenger, CFS, MGD Wealth, 2026.",
  },
  {
    question: "What is the $510,000 strategy I keep hearing about?",
    answer: "This is the optimal strategy for eligible people who have not triggered bring-forward yet. Step 1: contribute $120,000 before June 30, 2026. This uses the current annual cap but does NOT trigger the bring-forward rule — as long as you do not exceed $120,000 in the current year. Step 2: from July 1, 2026, trigger the full three-year bring-forward of $390,000. Total contributed across two financial years: $510,000. This is $150,000 more than triggering bring-forward now at $360,000. Your balance must be under $1,840,000 at June 30, 2026 to access the full $390,000. Get advice before acting — timing and sequencing are critical. Source: Heffron, Synectic, 2026.",
  },
  {
    question: "What is the carry-forward rule and why does June 30 matter?",
    answer: "The carry-forward (or catch-up) rule lets you use unused concessional contribution cap space from the previous five years in a single higher-contribution year — if your balance is under $500,000. This can result in a very large tax-deductible contribution in one year. The urgent issue: unused cap space from the 2020-21 financial year expires permanently on June 30, 2026. After that date it cannot be used, extended, or carried forward under any circumstances. If your balance is under $500,000 and you think you may have unused space from 2020-21, check myGov now. Source: Hudson Financial, Grant Thornton, 2026.",
  },
  {
    question: "How does my balance at June 30, 2026 determine how much I can contribute?",
    answer: "Your eligibility to use the bring-forward rule depends on your Total Super Balance (TSB) at June 30, 2026 — not today's balance. If your TSB is under $1,840,000 at June 30, 2026, you can contribute the full $390,000 (three years) from July 1. Between $1,840,000 and $1,970,000: $260,000 (two years). Between $1,970,000 and $2,100,000: $130,000 annual cap only. At or over $2,100,000: no non-concessional contributions. If you are close to any of these thresholds, your exact June 30 balance matters enormously. A withdrawal before June 30 might change your eligibility band. Source: Gavin Ma, Heffron, ATO, 2026.",
  },
  {
    question: "Can my partner and I both use the bring-forward rule?",
    answer: "Yes — the bring-forward rule applies to each person individually. If you and your partner both have TSBs under the thresholds, you can both contribute. Example: you each have $1.5M in super and are both under 75. Each of you can contribute $390,000 from July 1, 2026. Total: $780,000 goes into super in one year between you. This is one of the most powerful wealth accumulation strategies available in the Australian super system. Each person's eligibility is assessed separately based on their own TSB at June 30, 2026. Source: ATO, Heffron, 2026.",
  },
  {
    question: "I am 68. Do I still need to meet a work test?",
    answer: "No — the work test for non-concessional contributions was removed from July 1, 2022 for people aged 67-74. You can make non-concessional contributions (including bring-forward) up to age 75 without meeting a work test. However, if you want to claim a tax deduction on a personal concessional contribution (not a non-concessional), the work test still applies if you are 67 or over. Non-concessional contributions (the bring-forward amounts) do not require the work test for ages 67-74. You must be under 75 at the time of the contribution. Source: ATO, ITAA 1997.",
  },
  {
    question: "Does contributing more into super affect my Division 296 tax?",
    answer: "Yes — and this interaction is important to model before contributing. If your current super balance is between $2.5M and $3M, contributing $390,000 could push your balance over the $3 million Division 296 threshold. That means future earnings on the amount above $3M will attract an additional 15% tax (30% effective rate total). In some cases the income tax saving from the contribution (by investing inside super at 15% instead of at your marginal rate of up to 47%) still outweighs the Div 296 cost. In other cases, especially if you have significant unrealised gains, it may not. This requires individual modelling. Run the Div 296 Wealth Eraser calculator on this site as well. Source: Division 296, ITAA 1997 (Subdiv 296-B).",
  },
  {
    question: "What happens if I contribute too much — excess non-concessional contributions?",
    answer: "Excess non-concessional contributions are taxed at your marginal rate (minus the 15% offset for tax already paid by the fund). The ATO issues an excess contributions determination and you have the option to withdraw the excess from super. If you leave it in super, the excess is treated as taxable income. This can be an expensive mistake — on $30,000 excess at a 47% marginal rate, the additional tax is approximately $9,600. Always check your carry-forward balance and current bring-forward status in myGov before contributing. Source: ATO, ITAA 1997.",
  },
  {
    question: "My accountant sees me once a year at tax time. Will they know about this?",
    answer: "The new caps from July 1, 2026 are not new legislation — they are the result of automatic indexation. Your accountant should know about them. But the interaction between the bring-forward rule, the carry-forward concessional rule, the June 30 deadlines, and your specific balance requires a conversation. The five questions listed on this page give you a starting point. Take them — and the result from this calculator — to your next meeting. The timing decision (before June 30 vs after July 1) can make a material difference and needs to be made before June 30.",
  },
];

const aiErrors = [
  {
    wrong: '"You can contribute $390,000 into super from July 2026 — just do it"',
    correct: "Only if your TSB is under $1,840,000 at June 30, 2026 AND you have not already triggered the bring-forward rule in 2024-25 or 2025-26. If either condition applies, you are either limited to a smaller amount or locked out of the new cap entirely. Eligibility depends on your specific balance and history.",
    ref: "ATO NCC cap rules, ITAA 1997 s.292-85",
  },
  {
    wrong: '"The bring-forward amount increases to $390,000 for everyone from July 1"',
    correct: "People who have already triggered a bring-forward period in 2024-25 or 2025-26 remain locked at $360,000 for that period — the indexation does not apply mid-stream. Only those who have not yet triggered can access the new $390,000 cap.",
    ref: "Challenger, CFS, MGD Wealth — confirmed 2026",
  },
  {
    wrong: '"Put your carry-forward concessional contributions in anytime — no rush"',
    correct: "Unused concessional contribution space from the 2020-21 financial year expires permanently on June 30, 2026. There is no extension. If you have a balance under $500,000 and unused 2020-21 space, June 30 is the hard deadline — not the tax return date.",
    ref: "Hudson Financial Planning, Grant Thornton — confirmed 2026",
  },
  {
    wrong: '"Non-concessional contributions are always a good idea if you have spare cash"',
    correct: "Not always — especially if contributing pushes your balance over $3 million and into Division 296 territory. The income tax saving from contributing inside super (15% rate vs up to 47% marginal) must be weighed against the Div 296 cost on future earnings above $3M. These two decisions must be modelled together.",
    ref: "Division 296, ITAA 1997 (Subdiv 296-B) — enacted 10 March 2026",
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function BringForwardWindowPage() {
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
    name: "Super Bring-Forward $390K Eligibility Rules 2026-27",
    description: "Machine-readable bring-forward contribution eligibility thresholds for Australian super from July 1 2026. TSB under $1.84M: $390,000 (3 years). $1.84M-$1.97M: $260,000 (2 years). $1.97M-$2.1M: $130,000. Over $2.1M: $0. 2020-21 carry-forward expires June 30 2026.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    dateModified: "2026-04-15",
    keywords: ["bring forward rule", "super contributions 2026", "$390000", "non-concessional", "carry forward expiry", "June 30 2026", "super cap increase"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bring-Forward $390K Window Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/bring-forward-window",
    description: "Free eligibility check for the bring-forward $390,000 non-concessional contribution rule from July 1 2026. Shows TSB band, locked-out status, and carry-forward deadline.",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    offers: [
      { "@type": "Offer", price: "67", priceCurrency: "AUD", name: "Bring-Forward $390K Decision Pack" },
      { "@type": "Offer", price: "147", priceCurrency: "AUD", name: "Bring-Forward $390K Planning Pack" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to check your eligibility for the bring-forward $390,000 super contribution from July 2026",
    description: "Free 2-minute eligibility check showing how much you can contribute, whether you are locked out by a prior bring-forward, and whether carry-forward 2020-21 amounts expire on June 30.",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Enter your total super balance", text: "Your TSB across all accounts — estimated at June 30, 2026.", position: 1 },
      { "@type": "HowToStep", name: "Enter your age", text: "Must be under 75 to make non-concessional contributions.", position: 2 },
      { "@type": "HowToStep", name: "Confirm bring-forward status", text: "Whether you have already triggered the bring-forward rule in 2024-25 or 2025-26.", position: 3 },
      { "@type": "HowToStep", name: "Enter carry-forward amount (if applicable)", text: "Estimate of unused concessional cap space if your balance is under $500,000.", position: 4 },
      { "@type": "HowToStep", name: "See your result", text: "Your eligibility band, maximum contribution, and strategy recommendation.", position: 5 },
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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs font-bold text-emerald-600">Bring-Forward $390K Window</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">

          {/* ── SECTION 1: HERO ── */}
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                  Bring-Forward $390K Window · Opportunity
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              From July 1, you can put up to $390,000 into super in one go.{" "}
              <span className="font-light text-neutral-400">But two traps catch most people.</span>
            </h1>

            {/* Accountant moment */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Your accountant probably knows about the new cap — but may not have reviewed your specific eligibility.
              </p>
              <p className="text-sm text-amber-800">
                The $390,000 bring-forward is available from July 1. But if you already triggered bring-forward in the past two years, you are locked out of the new cap. And unused super contribution space from the 2020-21 year expires permanently on June 30. Two separate issues. Both need attention before June 30. This calculator checks both in 2 minutes.
              </p>
            </div>

            {/* Two traps */}
            <div className="mt-4 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-700 mb-2">Two traps most people miss</p>
              <div className="space-y-1.5 text-sm text-red-900">
                <p><strong>Locked-out trap:</strong> If you triggered bring-forward in 2024-25 or 2025-26, you are locked in at $360,000 — not $390,000. The higher cap does not apply mid-period.</p>
                <p><strong>Carry-forward expiry:</strong> Unused concessional cap space from 2020-21 expires permanently on June 30, 2026. No extension. No exception.</p>
              </div>
            </div>

            {/* BLUF */}
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">From July 1, eligible Australians can put up to $390,000 into super in one hit</strong>{" "}
              — money that grows inside the fund at up to 15% tax instead of at your marginal rate of up to 47%.{" "}
              The best strategy for people who have not triggered bring-forward yet:{" "}
              <strong className="text-neutral-950">contribute $120,000 before June 30, then $390,000 from July 1 — a total of $510,000 across two years.</strong>{" "}
              But eligibility depends on your exact balance at June 30, 2026 and your prior contribution history.{" "}
              <span className="font-mono text-sm text-neutral-400">Source: ATO, Heffron, Grant Thornton, April 2026.</span>
            </p>

            {/* Mobile CTA */}
            <div className="mt-5 sm:hidden">
              <a href="#calculator" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800">
                ↓ Check my eligibility — 2 minutes
              </a>
            </div>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <BringForwardWindowCalculator />

              {/* RIGHT: Sidebar */}
              <div className="space-y-4">

                {/* Caps summary */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">New caps from July 1, 2026</p>
                  <div className="space-y-2">
                    {[
                      { label: "Annual after-tax cap", before: "$120,000", after: "$130,000" },
                      { label: "3-year bring-forward", before: "$360,000", after: "$390,000" },
                      { label: "Before-tax (concessional) cap", before: "$30,000", after: "$32,500" },
                      { label: "Transfer Balance Cap", before: "$2,000,000", after: "$2,100,000" },
                    ].map((row) => (
                      <div key={row.label} className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <p className="text-xs font-semibold text-neutral-700 mb-1">{row.label}</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-xs text-neutral-400 line-through">{row.before}</p>
                          <span className="text-neutral-300">→</span>
                          <p className="font-mono text-sm font-bold text-emerald-700">{row.after}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-400">Source: ATO, Heffron, Grant Thornton · {lastVerified}</p>
                </div>

                {/* June 30 countdown */}
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-red-600">2020-21 carry-forward expiry</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-red-700">{days}</span>
                    <span className="font-mono text-xs text-red-500">days to June 30 2026</span>
                  </div>
                  <p className="mt-1 text-xs text-red-700">Unused 2020-21 concessional space expires permanently. No extension.</p>
                </div>

                {/* Two packs */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Two packs. One window.</p>
                  <div className="mb-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">Am I eligible? What is the right timing?</p>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Planning Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">I am eligible — give me everything to act.</p>
                  </div>
                </div>

                {/* Legal */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Primary sources</p>
                  <div className="space-y-1">
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/non-concessional-contributions-cap" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Non-concessional contributions cap ↗</a>
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/general-transfer-balance-cap-indexation-on-1-july-2026" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — TBC indexation July 2026 ↗</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── INLINE CTA ── */}
          <div className="flex justify-center">
            <a href="#calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50">
              ↓ Check my eligibility — 2 minutes
            </a>
          </div>

          {/* ── SECTION 2: PLAIN ENGLISH TRANSLATION ── */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Plain English — what this means for you</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
                Here is the opportunity — and the two traps — explained simply.
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-neutral-700">
                <p>
                  <strong className="text-neutral-950">Gary is 63.</strong> His super fund is worth $1.6 million. He sold an investment property last year and has $400,000 sitting in his bank account earning interest at his marginal rate — around 47% tax on the interest income.
                </p>
                <p>
                  Gary's accountant mentioned something about "bring-forward contributions" at their last meeting. Gary did not fully follow the detail. But the short version is this: from July 1, Gary can move up to $390,000 of that $400,000 into super in a single year. Once it is in super, the earnings are taxed at 15% — not 47%.
                </p>
                <p>
                  <strong className="text-neutral-950">But Gary has two things to check first.</strong>
                </p>
                <p>
                  First: has Gary contributed a large after-tax amount to super in the last couple of years? If he triggered the bring-forward rule in 2024-25 or 2025-26, he may already be in a three-year period locked at $360,000. If that is the case, he cannot access the new $390,000 cap — he is stuck at whatever was available when he triggered. He needs to check myGov.
                </p>
                <p>
                  Second: Gary has not maxed out his concessional (before-tax) contributions every year. That means he has unused space sitting in his history. But the 2020-21 unused space expires on June 30, 2026. Permanently. If Gary has a balance under $500,000 and any unused space from that year, he needs to act before June 30.
                </p>
                <p>
                  <strong className="text-neutral-950">If Gary has not triggered bring-forward and his balance stays under $1.84M at June 30</strong>, his optimal strategy is: contribute $120,000 before June 30 (the current annual cap — does not trigger bring-forward), then contribute $390,000 from July 1. Total into super: $510,000 across two financial years. That is $510,000 moving from 47% tax to 15% tax on future earnings.
                </p>
                <p className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                  <strong className="text-neutral-950">The bottom line:</strong> Run the calculator above. It checks your eligibility, your balance band, and whether the June 30 carry-forward deadline affects you. Takes 2 minutes. Then take the result to your accountant.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: ELIGIBILITY TABLE ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Eligibility by balance — July 1, 2026</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              How much you can contribute depends on your balance at June 30, 2026.
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="min-w-full border-separate border-spacing-0 bg-white text-left">
                <thead>
                  <tr>
                    {["Your super balance at June 30, 2026", "Max contribution", "Period", "Notes"].map((h) => (
                      <th key={h} className="border-b border-neutral-200 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eligibilityTable.map((row, i) => (
                    <tr key={i}>
                      <td className="border-b border-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-950">{row.tsb}</td>
                      <td className={`border-b border-neutral-100 px-4 py-3 font-mono text-sm font-bold ${row.cap === "$0" ? "text-red-600" : "text-emerald-700"}`}>{row.cap}</td>
                      <td className="border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700">{row.years}</td>
                      <td className="border-b border-neutral-100 px-4 py-3 text-xs text-neutral-500">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs text-amber-900">
                <strong>Important:</strong> These thresholds apply only if you have NOT already triggered a bring-forward period. If you triggered in 2024-25 or 2025-26, you are locked at $360,000 regardless of your balance. Source: ATO, Heffron, Gavin Ma, April 2026.
              </p>
            </div>
          </section>

          {/* ── SECTION 4: WHAT TO ASK YOUR ACCOUNTANT ── */}
          <section>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">Five questions to ask your accountant</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                Take these in before June 30.
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                The timing of this decision — before or after June 30 — can make a material difference. These questions get your accountant focused on the right issues.
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
                  <strong>Tip:</strong> Run the calculator first and take the result with you. Having your eligibility band and the strategy recommendation in writing makes the conversation concrete and focused. Your accountant can then confirm with your exact numbers.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 5: DEADLINE TRACKER ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Key deadlines — what to do and when</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
              Two deadlines before June 30. Both matter.
            </h2>
            <div className="space-y-3">
              {deadlineItems.map((item, i) => (
                <div key={i} className={`flex gap-4 rounded-xl border p-4 ${item.urgent ? "border-red-200 bg-red-50" : "border-neutral-200 bg-white"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${item.urgent ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-500"}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${item.urgent ? "text-red-600" : "text-neutral-400"}`}>{item.when}</span>
                      {item.urgent && <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-red-700">Act before June 30</span>}
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
              Questions people are actually asking about the new super contribution caps.
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
                We wrote a plain English guide to the new super tax. All three problems. No jargon.
              </h2>
              <p className="text-sm text-neutral-300 mb-5">
                Covers the June 30 deadline, the death benefit tax on your kids, and whether moving to a trust makes sense. Written the way a smart mate would explain it.
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
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/check/div296-wealth-eraser"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">Gate 01 · {days} days left</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">June 30 Cost-Base Reset</p>
                <p className="text-xs text-neutral-500">One-time chance to lock in today's values before June 30. If you are contributing more into super — this decision interacts with the reset.</p>
              </Link>
              <Link href="/check/death-benefit-tax-wall"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">Gate 02</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">Death Benefit Tax-Wall</p>
                <p className="text-xs text-neutral-500">Contributing more into super? Make sure your kids are not paying 17% tax on it when you die. Free calculator.</p>
              </Link>
              <Link href="/what-is-the-new-super-tax"
                className="group rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition hover:bg-neutral-900">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Plain English guide</p>
                <p className="text-sm font-semibold text-white mb-1">All three problems explained</p>
                <p className="text-xs text-neutral-400">No jargon. No email. Written for you — not your accountant.</p>
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
                    Non-concessional contribution caps from ITAA 1997 s.292-85. Thresholds calculated as: TBC − (n × NCC). 2020-21 carry-forward expiry confirmed by ATO and multiple specialists. All figures driven by February 2026 AWOTE data. Last verified: {lastVerified}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["ITAA 1997 s.292-85", "NCC cap", "ATO confirmed", "Heffron"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Non-concessional contributions cap (official)", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/non-concessional-contributions-cap" },
                    { label: "ATO — General TBC indexation July 2026", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/general-transfer-balance-cap-indexation-on-1-july-2026" },
                    { label: "Heffron — Bring-forward rule when caps change", href: "https://www.heffron.com.au/news/bring-forward-rules-when-caps-are-changing" },
                    { label: "Grant Thornton — Contribution cap changes July 2026", href: "https://www.grantthornton.com.au/insights/client-alerts/time-to-revise-your-superannuation-strategy/" },
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
                The information on this page is general in nature and does not constitute personal financial, legal, or tax advice. SuperTaxCheck provides decision-support tools based on current ATO guidance and ITAA 1997. Contribution caps and eligibility rules are complex and individual-specific. Always engage a qualified SMSF specialist before acting.{" "}
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
