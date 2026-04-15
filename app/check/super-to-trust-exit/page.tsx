import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import SuperToTrustExitCalculator from "./SuperToTrustExitCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Super-to-Trust Exit Logic System | SuperTaxCheck",
  description:
    "Is superannuation still the right structure for wealth above $10M after Division 296? The 40% effective tax rate changes the calculation — but exit costs, CGT, and stamp duty often make staying in super the better outcome. Free 10-year model. Built on Division 296, ITAA 1997.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/super-to-trust-exit",
  },
  openGraph: {
    title: "Super-to-Trust Exit Logic System | SuperTaxCheck",
    description:
      "The 40% Div 296 rate above $10M changes the maths — but the exit cost often kills the case. Free 10-year comparative model.",
    url: "https://supertaxcheck.com.au/check/super-to-trust-exit",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

const comparisonTable = [
  { factor: "Tax on earnings $3M-$10M", super: "30% effective (15% fund + 15% Div 296)", trust: "Up to 47% marginal OR 25-30% via bucket company", verdict: "Super wins" },
  { factor: "Tax on earnings above $10M", super: "40% effective (15% fund + 25% Div 296)", trust: "25-30% via bucket company structure", verdict: "Requires modelling" },
  { factor: "CGT on exit from super", super: "No CGT on exit (tax inside the fund on gains)", trust: "CGT triggered on all unrealised gains at exit", verdict: "Super wins" },
  { factor: "Stamp duty on property", super: "No stamp duty within SMSF", trust: "3-5.5% stamp duty on property transfers", verdict: "Super wins" },
  { factor: "Cost base reset availability", super: "Available for directly held SMSF assets only", trust: "NOT available for assets via unit trusts or companies", verdict: "Super wins (direct only)" },
  { factor: "Death benefit tax for adult children", super: "17% on taxable component", trust: "No death benefit tax — assets pass through estate", verdict: "Trust wins" },
  { factor: "Distributing FROM trust TO SMSF", super: "NALI — taxed at 45% if trust distributes to SMSF", trust: "Cannot move income freely between structures", verdict: "Critical trap" },
  { factor: "Asset access before retirement", super: "Preservation rules apply until retirement", trust: "No preservation — full access anytime", verdict: "Trust wins" },
];

const aiErrors = [
  {
    wrong: '"Move your SMSF assets to a family trust to avoid Division 296 tax"',
    correct: "Exit triggers CGT on all unrealised gains, stamp duty on property (3-5.5%), possible GST on commercial property, and permanently loses the 15% concessional rate on future earnings. On a $12M SMSF with 40% unrealised gains, exit costs can exceed $500,000 before saving a dollar of Div 296 tax. Source: Bartier Partners, April 2026.",
  },
  {
    wrong: '"Run a family trust alongside your SMSF and distribute income between them"',
    correct: "Distributing income FROM a family trust TO your SMSF is Non-Arm's Length Income (NALI) — taxed at 45%, not 15%. SMSF Adviser (January 2026): 'Allocating to an SMSF from a family trust will always be on arm's-length income — it's game over from a tax point of view. The income will be taxed at 45 per cent.'",
  },
  {
    wrong: '"The Division 296 cost base reset applies to all assets inside your SMSF"',
    correct: "The cost base reset ONLY applies to assets held DIRECTLY by the SMSF. Assets inside a unit trust or private company cannot access it — deliberately excluded in the explanatory memorandum. All pre-2026 gains on indirect assets remain fully exposed to Div 296 tax. Source: SMS Magazine — Sladen Legal, February 2026 ↗.",
  },
  {
    wrong: '"Super is no longer worth it above $3M — move everything to a trust"',
    correct: "Between $3M and $10M, super is still better than almost every alternative structure. Above $10M, individual modelling is required — but exit costs, CGT, stamp duty, and loss of concessional rates mean most people are still better off in super. SMSF Alliance (March 2026): super is 'still better than just about every other tax structure' for balances $3M-$10M.",
  },
];

const faqs = [
  {
    question: "Should I move my SMSF assets to a family trust to avoid Division 296?",
    answer: "Almost never automatically. Exit triggers CGT on all unrealised gains (15% after 50% CGT discount), stamp duty on property (3-5.5% depending on state), possible GST on commercial property, and permanently loses the 15% concessional rate on future earnings. On a $12M SMSF with 40% unrealised gains ($4.8M in gains), CGT on exit is approximately $360,000. Add NSW stamp duty on a $4M property at 4.5% — that is another $180,000. Total exit cost: $540,000 before saving a dollar of Div 296 tax. The exit cost must be recovered over many years of tax savings before the move makes sense. Source: Bartier Partners, April 2026.",
  },
  {
    question: "Can I have a family trust AND an SMSF and move money between them?",
    answer: "Yes — but there is a 45% tax trap. Assets can be held in both structures simultaneously and this is often sensible. However, you cannot distribute income FROM a family trust TO your SMSF. If a discretionary trust distributes to an SMSF, that income is Non-Arm's Length Income (NALI) taxed at 45% — not 15%. SMSF Adviser (January 2026): 'Allocating to an SMSF from a family trust will always be on arm's-length income. If you have a discretionary trust and make an allocation to the SMSF, it's game over from a tax point of view. The income will be taxed at 45 per cent.' The two structures can coexist but income must flow outward from the SMSF, not inward from the trust.",
  },
  {
    question: "Does the Division 296 cost base reset apply to my unit trust assets inside the SMSF?",
    answer: "No — deliberately excluded. The cost base reset is available ONLY for assets held directly by the SMSF. Assets via a unit trust or private company cannot access it. This was a deliberate policy decision confirmed in the explanatory memorandum — not an oversight. A pre-1999 unit trust holding a property with a cost base of $500,000 and market value of $2M: the entire $1.5M pre-2026 gain is fully exposed to Div 296 tax when realised. There is no cost base relief available. Source: Sladen Legal, Phil Broderick, SMS Magazine, February 2026.",
  },
  {
    question: "When does an exit to a family trust actually make sense?",
    answer: "Above $10M TSB, exit may be worth modelling when: (1) assets are liquid — shares or cash with no stamp duty on exit, (2) unrealised gains are low — low CGT cost to exit, (3) time horizon is 10+ years — trust has time to compound and overcome exit costs, (4) adult children are beneficiaries — no death benefit tax in a trust saves 17% on taxable component, and (5) bucket company structure keeps effective trust rate at 25-30%. The hybrid approach — keeping some in super near the $10M threshold and moving only the excess — is often superior to a full exit. Source: SMSF Alliance, Hudson Financial Planning, April 2026.",
  },
  {
    question: "What is a bucket company and how does it work with a family trust?",
    answer: "A bucket company is a private company used as a beneficiary of a discretionary (family) trust. Rather than distributing income to individuals at marginal rates (up to 47%), the trust distributes to the company which pays the 25-30% corporate rate. This makes the effective trust tax rate potentially competitive with super's 40% above $10M. However, extracting retained profits from the bucket company later as dividends triggers additional tax at the recipient's marginal rate. The net effective rate depends on whole-of-structure modelling over the intended time horizon — not just the company rate in isolation. Source: Quinn Group, Hudson Financial Planning, 2026.",
  },
  {
    question: "Is super still better than a trust between $3M and $10M?",
    answer: "Yes — almost always. The 30% effective Div 296 rate between $3M and $10M is still lower than the effective rate in most trust structures once exit costs, stamp duty, CGT on exit, and the permanent loss of the 15% concessional rate are factored in. SMSF Alliance principal David Busoli stated in March 2026 that for members with $3M-$10M, super is 'still better than just about every other tax structure.' The exception is where assets are liquid, unrealised gains are minimal, and there is a strong death benefit motivation with adult children beneficiaries and a high taxable component.",
  },
  {
    question: "What is the effective tax rate inside super above $10M?",
    answer: "Above $10M, the effective rate on earnings is 40%. The fund pays 15% income tax on all earnings. An additional 15% Division 296 tax applies on earnings proportionate to the $3M-$10M band. A further 10% Division 296 tax applies on earnings proportionate to the balance above $10M. ASFA example (2026): Emily, $12.9M SMSF, sells a property realising $840,000 capital gain. Division 296 tax applies on the proportion of earnings attributable to the balance above both thresholds — a significant additional personal tax bill on top of the fund's existing 15% tax. Both thresholds are CPI-indexed: $3M in $150,000 increments, $10M in $500,000 increments. Source: ASFA, ATO, Division 296, ITAA 1997 (Subdiv 296-B).",
  },
  {
    question: "What does it actually cost to transfer property out of my SMSF?",
    answer: "Transferring property from an SMSF to a family trust triggers multiple costs: (1) CGT — typically 15% after 50% CGT discount. On a $2M gain: $2M × 50% × 15% = $150,000. (2) Stamp duty — NSW up to 4.5%, VIC up to 5.5%, QLD up to 3.5%. On a $3M property in NSW: approximately $135,000. (3) Possible GST on commercial property (may apply depending on structure). (4) Loss of the 15% concessional rate on future earnings permanently. Total exit cost on a $3M property with a $2M unrealised gain in NSW: approximately $285,000 before a single dollar of Div 296 tax is saved. These exit costs must be recovered over years before the exit makes economic sense. Source: Bartier Partners, April 2026.",
  },
  {
    question: "Does the hybrid approach work — keeping some in super and some in a trust?",
    answer: "Yes — and this is often the optimal structure above $10M. The hybrid approach keeps enough in super to stay near the $10M VLSBT threshold, while moving excess wealth to a family trust with a bucket company. This eliminates the 40% rate on the excess while retaining the 30% rate on the super component. The key is that assets move FROM super TO trust once on exit (triggering exit costs), not as ongoing distributions between the two structures. The trust then compounds separately. The optimal split depends on projected growth, time horizon, and estate planning intent. Source: Quinn Group, SMSF Alliance, 2026.",
  },
  {
    question: "My SMSF holds property through a unit trust. What are my options?",
    answer: "This is the most complex and potentially most costly scenario under Division 296. Unit trust assets cannot access the cost base reset — all pre-2026 gains remain fully exposed to Div 296 tax when realised. Options: (1) Hold and pay Div 296 tax on gains as the unit trust distributes assessable income to the SMSF each year. (2) Exit the unit trust structure — triggers CGT at unit trust level AND stamp duty on the underlying property. (3) Carefully manage distributions from the unit trust to minimise annual Div 296 exposure. There is no clean solution. Each option has material tax consequences that must be modelled individually. This requires urgent specialist modelling before 30 June 2026. Source: Sladen Legal, SMS Magazine, February 2026.",
  },
];

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
    name: "Super vs Trust Comparison — Division 296 2026",
    description: "Machine-readable comparison of superannuation vs family trust tax treatment under Division 296, including NALI rules, indirect asset trap, exit costs, and effective tax rates. Source: Division 296, ITAA 1997 (Subdiv 296-B).",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    dateModified: "2026-04-14",
    keywords: ["super to trust", "Division 296", "NALI", "unit trust", "family trust", "bucket company", "SMSF exit", "40 percent"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Super-to-Trust Exit Logic System",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/super-to-trust-exit",
    description: "Free 10-year comparative model: super vs family trust under Division 296. Includes exit costs, CGT, stamp duty, NALI trap, and indirect asset trap.",
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
    description: "Run a 10-year comparative model to determine whether staying in super or exiting to a family trust produces better outcomes under Division 296.",
    totalTime: "PT3M",
    step: [
      { "@type": "HowToStep", name: "Enter your Total Super Balance", text: "Enter your TSB across all accounts. Most relevant above $10M.", position: 1 },
      { "@type": "HowToStep", name: "Set your earnings rate", text: "Long-term average return. Default 7%.", position: 2 },
      { "@type": "HowToStep", name: "Estimate unrealised capital gains", text: "Percentage of TSB that is unrealised gain — determines CGT on exit.", position: 3 },
      { "@type": "HowToStep", name: "Select adult children count", text: "Adult children face 17% death benefit tax on super. Trusts avoid this.", position: 4 },
      { "@type": "HowToStep", name: "Select primary asset type", text: "Property via unit trust cannot access the cost base reset.", position: 5 },
      { "@type": "HowToStep", name: "Review the 10-year comparison", text: "Net family wealth after 10 years for both scenarios including exit costs.", position: 6 },
    ],
  };

  return (
    <>
      <Script id="jsonld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="jsonld-dataset" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <Script id="jsonld-webapp" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <Script id="jsonld-howto" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <div className="min-h-screen bg-white font-sans">

        <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
            <Link href="/" className="font-serif text-lg font-bold text-neutral-950">SuperTaxCheck</Link>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="font-mono text-xs font-bold text-blue-600">Gate 03 · Super-to-Trust Exit</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12">

          <section className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-700">
                  Super-to-Trust Exit Logic System · Gate 03 · Strategic
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Is superannuation still the right structure above $10M?{" "}
              <span className="font-light text-neutral-400">The exit cost usually kills the case.</span>
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">
                The 40% effective tax rate above $10M under Division 296 (ITAA 1997, Subdiv 296-B) changes the calculation —
              </strong>{" "}
              but exiting super into a family trust triggers CGT on all unrealised gains, stamp duty on property (3-5.5%), and permanently loses the 15% concessional rate on future earnings.{" "}
              <strong className="text-neutral-950">Between $3M and $10M, super still wins. Above $10M, model it.</strong>{" "}
              <span className="font-mono text-sm text-neutral-400">
                Source: SMSF Alliance, Bartier Partners, Division 296 ITAA 1997 (Subdiv 296-B), enacted 10 March 2026.
              </span>
            </p>

            <div className="mt-5 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-700">Two traps AI consistently misses</p>
              <div className="mt-2 space-y-1.5 text-sm text-red-900">
                <p><strong>NALI trap:</strong> Distributing income FROM a family trust TO your SMSF = 45% tax. Not 15%. This is not a strategy — it is a tax trap.</p>
                <p><strong>Indirect asset trap:</strong> Assets held via a unit trust inside your SMSF CANNOT access the Division 296 cost base reset. All pre-2026 gains fully exposed.</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
              <SuperToTrustExitCalculator />

              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Effective tax rates 2026</p>
                  <div className="space-y-2">
                    {[
                      { label: "Super $0-$3M (pension)", rate: "0%", color: "text-emerald-700" },
                      { label: "Super $0-$3M (accum.)", rate: "15%", color: "text-emerald-700" },
                      { label: "Super $3M-$10M", rate: "30%", color: "text-amber-700" },
                      { label: "Super above $10M", rate: "40%", color: "text-red-700" },
                      { label: "Trust (bucket company)", rate: "25-30%", color: "text-blue-700" },
                      { label: "Trust (marginal rates)", rate: "up to 47%", color: "text-red-700" },
                      { label: "NALI (trust to SMSF)", rate: "45%", color: "text-red-700" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <p className="text-xs text-neutral-700">{row.label}</p>
                        <p className={`font-mono text-sm font-bold ${row.color}`}>{row.rate}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-400">Source: Division 296, ITAA 1997 · {lastVerified}</p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Cost base reset deadline</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-white">{days}</span>
                    <span className="font-mono text-xs text-neutral-400">days to June 30 2026</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Direct SMSF assets only. Unit trust assets excluded.</p>
                  <Link href="/check/div296-wealth-eraser" className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-blue-400 hover:text-blue-300 transition underline">
                    Run Div 296 Wealth Eraser →
                  </Link>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Two products</p>
                  <div className="mb-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">Should I even model an exit?</p>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Planning Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">Full year-by-year model and exit documents.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Legal basis</p>
                  <div className="space-y-1 text-xs text-blue-900">
                    <p><strong>Subdiv 296-B, ITAA 1997</strong> — $10M VLSBT and 40% rate</p>
                    <p><strong>NALI, ITAA 1997</strong> — 45% on non-arm's length income</p>
                    <p><strong>Div 296, ITAA 1997</strong> — cost base reset (direct assets only)</p>
                    <p>Enacted: 10 March 2026</p>
                  </div>
                  <a href="/api/rules/div296.json" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex font-mono text-[10px] text-blue-600 hover:text-blue-800 transition underline">
                    View machine-readable dataset →
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Super vs trust — full comparison</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-2">Every factor that determines the outcome</h2>
              <p className="text-sm text-neutral-500 mb-5">No single factor wins. All must be modelled together for your specific situation.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead>
                    <tr>
                      {["Factor", "Superannuation (SMSF)", "Family Trust + Bucket Co.", "Verdict"].map((h) => (
                        <th key={h} className="border-b border-neutral-300 px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.map((row, i) => (
                      <tr key={i} className="bg-white">
                        <td className="border-b border-neutral-200 px-3 py-4 text-sm font-semibold text-neutral-950">{row.factor}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 text-sm text-neutral-700">{row.super}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 text-sm text-neutral-700">{row.trust}</td>
                        <td className={`border-b border-neutral-200 px-3 py-4 font-mono text-xs font-bold ${
                          row.verdict.includes("Super") ? "text-emerald-700" :
                          row.verdict.includes("Trust") ? "text-blue-700" : "text-amber-700"
                        }`}>{row.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 font-mono text-[10px] text-neutral-400">
                Source: Division 296, ITAA 1997 · SMSF Alliance · Bartier Partners · Sladen Legal · {lastVerified}
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">What AI gets wrong about the super-to-trust exit</h2>
            <div className="space-y-4">
              {aiErrors.map((item, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">Most AI says</p>
                      <p className="text-sm italic text-neutral-500">{item.wrong}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Enacted law says</p>
                      <p className="text-sm text-neutral-800">{item.correct}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">Super-to-trust exit — the questions SMSF trustees are actually asking</h2>
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

          <section>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-blue-600">Legislative source verification</p>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-blue-900">
                    Effective tax rates from Division 296, ITAA 1997 (Subdiv 296-B). NALI rules from ITAA 1997. Indirect asset exclusion confirmed in the explanatory memorandum. All law enacted <strong>10 March 2026</strong>. Last verified: {lastVerified}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Subdiv 296-B", "NALI rules", "ITAA 1997", "SIS Act", "ATO guidance"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources — verified against original legislation and specialist analysis</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Better Targeted Super Concessions (official — Subdiv 296-B)", href: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" },
                    { label: "SMS Magazine — New tax will slug indirect asset income (Sladen Legal)", href: "https://smsmagazine.com.au/news/2026/02/12/new-tax-will-slug-indirect-asset-income/" },
                    { label: "ATO — Non-Arm's Length Income (NALI) rules", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/investing/non-arm-s-length-income" },
                    { label: "Treasury Laws Amendment Act 2026 — full text", href: "https://www.legislation.gov.au/latest/C2026A00013" },
                  ].map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">
                      {s.label} ↗
                    </a>
                  ))}
                </div>
                <p className="font-mono text-[10px] text-blue-500">
                  The indirect asset exclusion from the cost base reset is confirmed in the explanatory memorandum as a deliberate policy decision — not an oversight. Source: Sladen Legal, Phil Broderick, SMS Magazine, February 2026.
                </p>
              </div>
            </div>
          </section>
        </main>

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
