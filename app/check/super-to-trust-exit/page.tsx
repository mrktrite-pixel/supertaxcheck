import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import SuperToTrustExitCalculator from "./SuperToTrustExitCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Should I Move My Super to a Family Trust? The Real Numbers | SuperTaxCheck",
  description:
    "Everyone is asking whether to move their SMSF to a family trust to avoid the new super tax. The answer is almost always no — the exit costs more than the tax you save. But above $10M it is worth running the numbers. Free 10-year model.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/super-to-trust-exit",
  },
  openGraph: {
    title: "Should I Move My Super to a Family Trust? The Real Numbers",
    description: "Exit costs — CGT, stamp duty, loss of 15% rate — usually kill the case. But above $10M the maths changes. Free 10-year model. 2 minutes.",
    url: "https://supertaxcheck.com.au/check/super-to-trust-exit",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

// ── DATA ───────────────────────────────────────────────────────────────────

const accountantQuestions = [
  {
    q: "Is my super fund still the best structure for my wealth above $3 million — or should I be modelling an exit?",
    why: "Most accountants will say 'yes, stay in super' — and for most people between $3M and $10M that is correct. But if you are above $10M, you deserve a modelled answer, not a general one. Ask for the 10-year comparison with your actual numbers.",
  },
  {
    q: "Does my fund hold any assets through a unit trust or private company inside the SMSF?",
    why: "If yes, those assets cannot access the Division 296 cost base reset. All the growth on those assets since you bought them is fully exposed to the new tax when sold. This is the indirect asset trap — and it is a separate problem from the exit question.",
  },
  {
    q: "If I moved my property out of super, what would it actually cost — in dollars — including stamp duty and CGT?",
    why: "Most people who ask 'should I exit?' have never seen the exit cost in dollars. On a $3M commercial property in NSW with a $2M gain, the exit costs alone are approximately $285,000 before you save a single dollar in Div 296 tax. You need that number.",
  },
  {
    q: "What is my effective Div 296 tax rate going to be on my specific fund — above $3M and above $10M if relevant?",
    why: "The rate is not the same for everyone. It depends on the size of your fund relative to the $3M and $10M thresholds, and what proportion of earnings falls above each threshold. Get your specific annual dollar amount — not a general percentage.",
  },
  {
    q: "If I wanted to run a hybrid approach — some in super, some in a trust — what would that look like for our family?",
    why: "The hybrid approach often beats a full exit. Keeping enough in super to stay near or below $10M, while holding excess wealth in a trust with a bucket company, can optimise across both Div 296 rates and estate planning. This needs specialist modelling.",
  },
];

const deadlineItems = [
  {
    when: "Before June 30 2026",
    what: "Cost base reset decision for directly held SMSF assets",
    consequence: "If you are staying in super — which most people should — the cost base reset on Gate 01 is a separate urgent decision. The reset locks in today's values on directly held assets. Indirect assets (unit trusts) cannot access it.",
    urgent: true,
  },
  {
    when: "Before June 30 2026",
    what: "Model your options while both doors are open",
    consequence: "Before June 30 you have two options: do the reset (stay in super, protect existing gains) OR exit (leave super, trigger CGT). After June 30, the reset option is gone permanently. You can still exit after June 30 — but you lose the reset.",
    urgent: true,
  },
  {
    when: "No hard deadline on the exit decision itself",
    what: "The trust exit decision has no June 30 deadline",
    consequence: "Unlike the cost base reset, moving assets out of super does not have a fixed deadline. But waiting means more Div 296 tax accumulating. And above $10M, the sooner you model it the sooner you know whether it makes sense.",
    urgent: false,
  },
  {
    when: "Ongoing — once you exit",
    what: "Trust and bucket company compliance",
    consequence: "A family trust with a bucket company requires annual tax returns, trustee resolutions, and careful distribution planning. This is more administration than staying in super. Factor this into the 10-year model.",
    urgent: false,
  },
];

const comparisonTable = [
  { factor: "Tax on earnings $3M-$10M", superCol: "30% effective (15% fund + 15% Div 296)", trust: "Up to 47% marginal or 25-30% via bucket company", verdict: "Super wins" },
  { factor: "Tax on earnings above $10M", superCol: "40% effective (15% fund + 25% Div 296)", trust: "25-30% via bucket company", verdict: "Worth modelling" },
  { factor: "CGT when you move assets out", superCol: "No CGT while inside super", trust: "CGT triggered on exit — 15% after 50% discount", verdict: "Super wins" },
  { factor: "Stamp duty on property", superCol: "No stamp duty inside SMSF", trust: "3-5.5% depending on state", verdict: "Super wins" },
  { factor: "Cost base reset (June 30)", superCol: "Available for directly held assets only", trust: "Not available — exit forfeits this option", verdict: "Super wins" },
  { factor: "Death benefit tax for adult kids", superCol: "17% on taxable part when you die", trust: "Zero — assets pass through your estate", verdict: "Trust wins" },
  { factor: "Distributing from trust TO SMSF", superCol: "45% NALI tax — not 15%", trust: "You cannot do this — it is a tax trap", verdict: "Critical trap" },
  { factor: "Access to money before retirement", superCol: "Locked in until retirement", trust: "No restrictions — full access anytime", verdict: "Trust wins" },
];

const faqs = [
  {
    question: "Should I move my super to a family trust to avoid the new super tax?",
    answer: "Almost never — and the exit cost is why. Moving assets out of your SMSF triggers CGT on all unrealised gains (15% after the 50% CGT discount), stamp duty on any property (3-5.5% depending on state), possible GST on commercial property, and permanently loses the 15% concessional tax rate on future earnings. On a $12M SMSF with 40% unrealised gains, the CGT alone on exit is $360,000. Add NSW stamp duty on a $4M property at 4.5% — that is another $180,000. Total exit cost: $540,000 before you save a dollar of Div 296 tax. Those exit costs must be recovered over many years of tax savings before the move makes economic sense. Source: Bartier Partners, April 2026.",
  },
  {
    question: "Everyone I speak to says to move to a trust. Is that right?",
    answer: "This is the most dangerous misconception circulating right now. Between $3M and $10M, the 30% effective Div 296 rate is still lower than the effective rate in most trust structures once you account for exit costs, stamp duty, CGT on exit, and the permanent loss of the 15% concessional rate. SMSF Alliance principal David Busoli stated in March 2026 that for members with $3M-$10M, super is 'still better than just about every other tax structure.' Above $10M it requires individual modelling — but even then, most people are still better off in super when all costs are counted.",
  },
  {
    question: "What is the NALI trap — and why does it matter?",
    answer: "NALI stands for Non-Arm's Length Income. Here is the trap: if you have a family trust AND an SMSF, you cannot distribute income from the trust into the SMSF. If a discretionary family trust distributes income to your SMSF, that income is classified as Non-Arm's Length Income and taxed at 45% — not 15%. Source: ATO.gov.au — 'income derived by an SMSF as a beneficiary of a trust (other than through holding a fixed entitlement) is non-arm's length income.' Most people who are told to 'run a trust alongside your SMSF' do not know this rule. The two structures can coexist — but income must flow outward from the SMSF, not inward from the trust. Source: ITAA 1997 s.295-550(4), ATO.gov.au confirmed.",
  },
  {
    question: "My SMSF holds property through a unit trust. Does the cost base reset apply?",
    answer: "No — and this is the indirect asset trap. The Division 296 cost base reset only applies to assets held DIRECTLY by your SMSF. Assets inside a unit trust or private company within the SMSF structure cannot access the reset. This was a deliberate policy decision — confirmed in the explanatory memorandum, not an oversight. Example: a pre-1999 unit trust inside your SMSF holds a property with a cost base of $500,000 and current value of $2M. The entire $1.5M pre-2026 gain cannot be reset. When the property is sold, that $1.5M gain is fully exposed to Div 296 tax. There is no fix. This requires urgent specialist advice before June 30. Source: Sladen Legal, Phil Broderick, SMS Magazine, February 2026.",
  },
  {
    question: "What does it actually cost to transfer property out of my SMSF?",
    answer: "More than most people expect. On a $3M commercial property with a $2M unrealised gain in NSW: CGT is approximately $150,000 (50% CGT discount × 15% fund tax × $2M gain). NSW stamp duty at 4.5% on the property value is approximately $135,000. Total exit cost before you save a dollar in Div 296 tax: approximately $285,000. In Victoria with 5.5% stamp duty on the same property: $165,000 stamp duty alone. These costs must be weighed against how much Div 296 tax you are actually paying. On a $4M fund, Div 296 is roughly $10,500 per year. At $285,000 in exit costs, you are looking at a 27-year payback before you break even — and that ignores the permanent loss of the 15% concessional rate on future earnings. Source: Bartier Partners, April 2026.",
  },
  {
    question: "When does it actually make sense to exit super into a trust?",
    answer: "Above $10M TSB, exit is worth modelling when all five conditions apply: (1) assets are liquid — shares or cash with no stamp duty on exit, (2) unrealised gains are low — small CGT cost to exit, (3) time horizon is 10+ years — the trust needs time to compound past the exit costs, (4) adult children are beneficiaries — the trust's zero death benefit tax saves 17% compared to super, and (5) a bucket company structure keeps the effective trust rate at 25-30%. The hybrid approach — keeping enough in super to stay near the $10M threshold and moving only the excess — is often superior to a full exit. Source: SMSF Alliance, Hudson Financial Planning, April 2026.",
  },
  {
    question: "What is a bucket company and how does it help with the trust tax rate?",
    answer: "A bucket company is a private company used as a beneficiary of a discretionary family trust. Instead of distributing income to individual family members at their marginal rate (up to 47%), the trust distributes to the company which pays the 25-30% corporate tax rate. This makes the effective trust tax rate potentially competitive with super's 40% above $10M. But extracting those profits from the bucket company later — as dividends or wages — triggers additional tax at the recipient's marginal rate. The net effective rate depends on whole-of-structure modelling over the intended time horizon. The company rate alone is not the answer. Source: Quinn Group, Hudson Financial Planning, 2026.",
  },
  {
    question: "Does the hybrid approach work — some in super, some in a trust?",
    answer: "Yes — and this is often the best structure above $10M. The hybrid approach keeps enough in super to stay near the $10M VLSBT threshold, while holding excess wealth in a family trust with a bucket company. This removes the 40% rate on the excess while keeping the 30% rate on the super component. The key is that assets move FROM super TO trust once at exit (triggering exit costs that one time), not as ongoing distributions between the two structures. After exit, the trust compounds separately under its own tax structure. The optimal split between super and trust depends on projected growth, time horizon, family structure, and estate planning intent. Source: Quinn Group, SMSF Alliance, 2026.",
  },
  {
    question: "My accountant hasn't mentioned any of this. Should I be worried?",
    answer: "The Div 296 law passed on 10 March 2026 — six weeks ago. The super-to-trust question is complex and highly individual. Most accountants who see SMSF clients once a year at tax time may not have raised it yet — especially for clients who are below $10M where the answer is almost certainly to stay in super. If your fund is above $10M, or if you hold indirect assets in a unit trust, this is worth a specific conversation. Take the five questions above to your next meeting. Run the calculator on this page first so you have your numbers in front of you.",
  },
  {
    question: "My SMSF holds property through a unit trust. What are my options?",
    answer: "This is the most complex and potentially most costly scenario under Division 296. Your options are: (1) Hold and pay Div 296 tax on gains as they are realised — all pre-2026 gains are fully exposed because no cost base reset is available on indirect assets. (2) Exit the unit trust structure — triggers CGT at the unit trust level AND stamp duty on the underlying property. Two layers of cost. (3) Carefully manage when gains are realised to minimise annual Div 296 exposure. There is no clean solution. Each option has significant tax consequences. This requires individual specialist modelling before June 30. Source: Sladen Legal, SMS Magazine, February 2026.",
  },
];

const aiErrors = [
  {
    wrong: '"Move your SMSF assets to a family trust to avoid the new super tax"',
    correct: "Exit triggers CGT on all unrealised gains (15% after 50% CGT discount), stamp duty on property (3-5.5% by state), possible GST on commercial property, and permanently loses the 15% concessional rate forever. On a $12M SMSF with 40% unrealised gains, exit costs alone can reach $540,000 before saving a dollar of Div 296 tax. Source: Bartier Partners, April 2026.",
    ref: "Bartier Partners, April 2026 · Division 296, ITAA 1997",
  },
  {
    wrong: '"Run a family trust alongside your SMSF and move income between them"',
    correct: "Distributing income FROM a family trust TO your SMSF is Non-Arm's Length Income (NALI) — taxed at 45% not 15%. ATO primary source: 'income derived by an SMSF as a beneficiary of a trust (other than through holding a fixed entitlement) is non-arm's length income.' This is not a strategy — it is a tax trap. Source: ITAA 1997 s.295-550(4), ATO.gov.au.",
    ref: "ATO.gov.au — Non-arm's length income · ITAA 1997 s.295-550(4)",
  },
  {
    wrong: '"The cost base reset applies to all assets inside your SMSF"',
    correct: "The reset ONLY applies to assets held DIRECTLY by the SMSF. Assets inside a unit trust or private company within your SMSF cannot access the reset — deliberately excluded in the explanatory memorandum. All pre-2026 gains on those indirect assets remain fully exposed to Div 296 tax. Source: Sladen Legal, Phil Broderick, SMS Magazine, February 2026.",
    ref: "Sladen Legal, SMS Magazine, February 2026",
  },
  {
    wrong: '"Super is no longer worth it above $3M — move everything to a trust"',
    correct: "Between $3M and $10M, super is still better than almost every alternative structure. SMSF Alliance (March 2026): super is 'still better than just about every other tax structure' for balances between $3M and $10M. Above $10M it requires individual modelling — but exit costs, stamp duty, CGT, and loss of the concessional rate mean most people are still better off in super.",
    ref: "SMSF Alliance, David Busoli, March 2026",
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function SuperToTrustExitPage() {
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
    name: "Super vs Family Trust Comparison — Division 296 2026",
    description: "Machine-readable comparison: super vs family trust under Division 296. Includes NALI trap (45% tax on trust-to-SMSF distributions), indirect asset exclusion from cost base reset, exit costs (CGT + stamp duty), and effective tax rates. Source: ITAA 1997, Division 296 (Subdiv 296-B), ATO.gov.au.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    dateModified: "2026-04-15",
    keywords: ["super to trust", "SMSF family trust", "Division 296", "NALI trap", "indirect asset", "unit trust", "bucket company", "exit costs", "40% super tax"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Super-to-Trust Exit Logic System",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/super-to-trust-exit",
    description: "Free 10-year model comparing super vs family trust under Division 296. Shows exit costs, CGT, stamp duty, NALI trap, and indirect asset trap.",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    offers: [
      { "@type": "Offer", price: "67", priceCurrency: "AUD", name: "Super-to-Trust Exit Decision Pack" },
      { "@type": "Offer", price: "147", priceCurrency: "AUD", name: "Super-to-Trust Exit Planning Pack" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to model super vs family trust under Division 296",
    description: "A free 10-year model showing whether staying in super or exiting to a family trust produces better outcomes after Division 296.",
    totalTime: "PT3M",
    step: [
      { "@type": "HowToStep", name: "Enter your total super balance", text: "Your TSB across all accounts. The model is most relevant above $10M.", position: 1 },
      { "@type": "HowToStep", name: "Set your estimated earnings rate", text: "Long-term average return. Default 7%.", position: 2 },
      { "@type": "HowToStep", name: "Estimate unrealised capital gains", text: "Percentage of your balance that is unrealised gain — determines CGT cost on exit.", position: 3 },
      { "@type": "HowToStep", name: "Select adult children count", text: "Adult kids face 17% death benefit tax on super. Trusts avoid this — affects the 10-year comparison.", position: 4 },
      { "@type": "HowToStep", name: "Select primary asset type", text: "Property via unit trust cannot access the cost base reset. Shares have no stamp duty on exit.", position: 5 },
      { "@type": "HowToStep", name: "See the 10-year comparison", text: "Net family wealth after 10 years for both scenarios — including all exit costs and ongoing tax.", position: 6 },
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
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="font-mono text-xs font-bold text-blue-600">Super-to-Trust Exit</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">

          {/* ── SECTION 1: HERO ── */}
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-700">
                  Super-to-Trust Exit · Strategic Decision
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Everyone is asking whether to move their super to a family trust.{" "}
              <span className="font-light text-neutral-400">The exit usually costs more than the tax you save.</span>
            </h1>

            {/* "Your accountant hasn't called" moment */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                This question is being asked everywhere — and most of the answers are wrong.
              </p>
              <p className="text-sm text-amber-800">
                Between $3M and $10M, super is still better than a trust for almost everyone. Above $10M it is worth modelling. But two traps catch most people who try to move: the exit cost (CGT + stamp duty) is usually larger than years of Div 296 savings, and distributing income from a trust into an SMSF triggers a 45% tax rate — not 15%. Run the free calculator below to see the 10-year comparison for your fund.
              </p>
            </div>

            {/* Two traps warning */}
            <div className="mt-4 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-700 mb-2">Two traps most AI tools miss</p>
              <div className="space-y-1.5 text-sm text-red-900">
                <p><strong>NALI trap:</strong> Distributing income from a family trust TO your SMSF = 45% tax. Not 15%. This is not a strategy — it is a tax trap. Source: ATO.gov.au, ITAA 1997 s.295-550(4).</p>
                <p><strong>Indirect asset trap:</strong> Assets held via a unit trust inside your SMSF CANNOT access the cost base reset. All pre-2026 gains on those assets are fully exposed to Div 296. Source: Sladen Legal, February 2026.</p>
              </div>
            </div>

            {/* BLUF */}
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">The 40% effective rate above $10M under Division 296 changes the calculation</strong>{" "}
              — but exiting super into a family trust triggers CGT on all unrealised gains, stamp duty on property (3-5.5%), and permanently loses the 15% concessional rate on future earnings.{" "}
              <strong className="text-neutral-950">Between $3M and $10M, super still wins. Above $10M, model it carefully.</strong>{" "}
              <span className="font-mono text-sm text-neutral-400">Source: SMSF Alliance, Bartier Partners, Division 296, ITAA 1997 (Subdiv 296-B), enacted 10 March 2026.</span>
            </p>

            {/* Mobile CTA */}
            <div className="mt-5 sm:hidden">
              <a href="#calculator" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800">
                Run the 10-year model →
              </a>
            </div>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <div id="calculator">
                <SuperToTrustExitCalculator />
              </div>

              {/* RIGHT: Sidebar */}
              <div className="space-y-4">

                {/* Tax rate quick ref */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Effective tax rates 2026</p>
                  <div className="space-y-2">
                    {[
                      { label: "Super — pension phase", rate: "0%", colour: "emerald" },
                      { label: "Super — accumulation", rate: "15%", colour: "emerald" },
                      { label: "Super $3M-$10M", rate: "30%", colour: "amber" },
                      { label: "Super above $10M", rate: "40%", colour: "red" },
                      { label: "Trust — bucket company", rate: "25-30%", colour: "blue" },
                      { label: "Trust income to SMSF (NALI)", rate: "45%", colour: "red" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <p className="text-xs text-neutral-700">{row.label}</p>
                        <p className={`font-mono text-sm font-bold ml-2 shrink-0 ${row.colour === "emerald" ? "text-emerald-700" : row.colour === "red" ? "text-red-700" : row.colour === "blue" ? "text-blue-700" : "text-amber-700"}`}>{row.rate}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-400">Source: Division 296, ITAA 1997 · {lastVerified}</p>
                </div>

                {/* Deadline */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Cost base reset deadline</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-white">{days}</span>
                    <span className="font-mono text-xs text-neutral-400">days to June 30 2026</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">If you are staying in super, the reset on directly held assets is a separate urgent decision. Indirect assets excluded.</p>
                  <Link href="/check/div296-wealth-eraser" className="mt-3 inline-flex font-mono text-[10px] text-blue-400 hover:text-blue-300 transition underline">
                    Run the June 30 calculator →
                  </Link>
                </div>

                {/* Two packs */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Two packs. One question.</p>
                  <div className="mb-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">Should I even model an exit?</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Your 10-year comparative model", "Exit cost calculator (your state)", "Indirect asset trap guide", "NALI trap explainer", "When super still wins — the cases", "Brief for your SMSF specialist"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-neutral-100 pt-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Planning Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">The exit makes sense — give me everything.</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Everything in the Decision Pack", "Year-by-year 10-year model", "Exit execution checklist", "Bucket company integration guide", "Hybrid strategy document"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0 text-blue-500">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Legal */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Primary sources</p>
                  <div className="space-y-1">
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/tax-on-income/non-arm-s-length-income" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Non-Arm's Length Income (NALI) ↗</a>
                    <a href="https://smsmagazine.com.au/news/2026/02/12/new-tax-will-slug-indirect-asset-income/" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">SMS Magazine — Sladen Legal, indirect asset trap ↗</a>
                    <a href="https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Better Targeted Super Concessions ↗</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: PLAIN ENGLISH TRANSLATION ── */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Plain English — what is actually going on</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
                Here is the trust question explained — without the jargon.
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-neutral-700">
                <p>
                  <strong className="text-neutral-950">Gary has $12M in his SMSF.</strong> A commercial property worth $5M (bought for $1.2M 18 years ago), shares worth $4M, and $3M in cash. From July 1, the new super tax applies to the earnings above $10M at 40% — plus 30% on the earnings between $3M and $10M.
                </p>
                <p>
                  Gary's mate told him at the pub: "just move it all into a family trust, mate. Avoid the whole thing." Gary's accountant, who sees him once a year at tax time, has not called him about it yet.
                </p>
                <p>
                  <strong className="text-neutral-950">Here is what Gary's mate does not know.</strong> Moving the property out of Gary's SMSF triggers CGT on the $3.8M gain. At 15% after the 50% CGT discount: $285,000. Then stamp duty on the $5M property in Queensland: approximately $175,000. Total to move the property out: $460,000. Before Gary has saved a dollar of Div 296 tax.
                </p>
                <p>
                  <strong className="text-neutral-950">And there is another trap.</strong> Gary thinks he can keep both — the family trust AND the SMSF — and move money between them as needed. He cannot. If his family trust distributes income to his SMSF, that income is classified as Non-Arm's Length Income (NALI) and taxed at 45%. The ATO calls it a tax trap. Gary's accountant would call it a very expensive mistake.
                </p>
                <p>
                  <strong className="text-neutral-950">But Gary is above $10M.</strong> So it is worth running the numbers properly. The shares and cash — no stamp duty on those. Low unrealised gains on the cash. The calculator below does the 10-year model for Gary's specific situation. For most people it shows super still wins. For some it shows the exit case is close enough to model with a specialist.
                </p>
                <p className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                  <strong className="text-neutral-950">The bottom line:</strong> Do not move because your mate said so. Run the calculator. Get the 10-year comparison. Take the result to your SMSF specialist. The answer depends on your specific numbers — not a general rule.
                </p>
              </div>

              <div className="mt-5 sm:hidden">
                <a href="#calculator" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800">
                  Run my 10-year model →
                </a>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: COMPARISON TABLE ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Super vs trust — every factor</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              Every factor that determines the outcome — all in one place.
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="min-w-full border-separate border-spacing-0 bg-white text-left">
                <thead>
                  <tr>
                    {["Factor", "Superannuation (SMSF)", "Family Trust + Bucket Co.", "Verdict"].map((h) => (
                      <th key={h} className="border-b border-neutral-200 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, i) => (
                    <tr key={i}>
                      <td className="border-b border-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-950">{row.factor}</td>
                      <td className="border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700">{row.superCol}</td>
                      <td className="border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700">{row.trust}</td>
                      <td className={`border-b border-neutral-100 px-4 py-3 font-mono text-xs font-bold ${row.verdict.includes("Super") ? "text-emerald-700" : row.verdict.includes("Trust") ? "text-blue-700" : "text-red-700"}`}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[10px] text-neutral-400">Source: Division 296, ITAA 1997 · SMSF Alliance · Bartier Partners · Sladen Legal · {lastVerified}</p>
          </section>

          {/* ── SECTION 4: WHAT TO ASK YOUR ACCOUNTANT ── */}
          <section>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">Five questions to ask your accountant</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                Take these in. Or send them in an email today.
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                These five questions will get you a modelled answer — not a general one.
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
                  <strong>Tip:</strong> Run the calculator on this page first and take the 10-year comparison result with you. Having the dollar figures — exit cost vs annual Div 296 saving vs 10-year outcome — makes the conversation concrete. Your accountant can then work with your specific numbers to model the right decision for your fund.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 5: DEADLINE TRACKER ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">What to do and when</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
              The exit itself has no hard deadline — but June 30 is still urgent for a different reason.
            </h2>
            <div className="space-y-3">
              {deadlineItems.map((item, i) => (
                <div key={i} className={`flex gap-4 rounded-xl border p-4 ${item.urgent ? "border-blue-200 bg-blue-50" : "border-neutral-200 bg-white"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${item.urgent ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-500"}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${item.urgent ? "text-blue-600" : "text-neutral-400"}`}>{item.when}</span>
                      {item.urgent && <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-blue-700">Think about this now</span>}
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
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">What most AI tools get wrong about this</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              If you Googled this or asked an AI — check these against what you were told.
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
                      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-2">The actual law says</p>
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
              Questions people are actually asking about super and family trusts.
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
                Covers the June 30 deadline, the death benefit tax on your kids, and the trust exit question. Written the way a smart mate would explain it. Not a lawyer. Not an accountant. Not the ATO.
              </p>
              <Link href="/what-is-the-new-super-tax"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100">
                Read the plain English guide →
              </Link>
              <p className="mt-3 font-mono text-[10px] text-neutral-500">Free. No email required.</p>
            </div>
          </section>

          {/* ── SECTION 9: LAW BAR ── */}
          <section>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-blue-600">Legislative source verification</p>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-blue-900">
                    Effective tax rates from Division 296, ITAA 1997 (Subdiv 296-B). NALI rules from ITAA 1997 s.295-550(4). Indirect asset exclusion confirmed in explanatory memorandum. All law enacted <strong>10 March 2026</strong>. Last verified: {lastVerified}.
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-blue-500">
                    The indirect asset exclusion from the cost base reset is a deliberate policy decision — not an oversight. Source: Sladen Legal, Phil Broderick, SMS Magazine, February 2026.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Subdiv 296-B", "NALI s.295-550", "ITAA 1997", "ATO Verified"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Non-Arm's Length Income (NALI)", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/tax-on-income/non-arm-s-length-income" },
                    { label: "ATO — Better Targeted Super Concessions (Subdiv 296-B)", href: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" },
                    { label: "SMS Magazine — Indirect asset trap (Sladen Legal)", href: "https://smsmagazine.com.au/news/2026/02/12/new-tax-will-slug-indirect-asset-income/" },
                    { label: "Treasury Laws Amendment Act 2026 — full text", href: "https://www.legislation.gov.au/latest/C2026A00013" },
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
                The information on this page is general in nature and does not constitute personal financial, legal, or tax advice. SuperTaxCheck provides decision-support tools based on the Income Tax Assessment Act 1997 and Treasury Laws Amendment Act enacted 10 March 2026. Always engage a qualified SMSF specialist before acting on the super-to-trust exit decision.{" "}
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
