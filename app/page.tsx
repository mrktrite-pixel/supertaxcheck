import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "SuperTaxCheck | Division 296 Tax Tools for Australian SMSF Trustees",
  description:
    "Three free calculators built on the Division 296 Act enacted 10 March 2026. Div 296 Wealth Eraser, Death Benefit Tax-Wall Calculator, and Super-to-Trust Exit Logic System for SMSF (Self-Managed Super Fund) trustees with $3M+ in superannuation.",
  alternates: {
    canonical: "https://supertaxcheck.com.au",
  },
  openGraph: {
    title: "SuperTaxCheck | Division 296 Tax Tools for SMSF Trustees",
    description:
      "Three free calculators built on the enacted law. Not the 2024 draft AI is still citing.",
    url: "https://supertaxcheck.com.au",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

// ── GATE DATA ──────────────────────────────────────────────────────────────
const GATES = [
  {
    number: "01",
    urgency: "URGENT" as const,
    status: "LIVE",
    statusColor: "border-emerald-200 bg-emerald-100 text-emerald-900",
    badgeColor: "border-red-200 bg-red-50 text-red-700",
    dotColor: "bg-red-500",
    cardBorder: "border-neutral-200 hover:border-red-300",
    accentBg: "bg-red-50",
    citationGapName: "Div 296 Wealth Eraser",
    productName: "June 30 Cost-Base Reset",
    headline: "What is your estimated Div 296 exposure before June 30?",
    desc: "SMSF (Self-Managed Super Fund) trustees have a single, one-time opportunity to reset their cost base before 30 June 2026. The election is irrevocable and all-or-nothing. Miss the window and the saving is permanently lost.",
    lawRef: "Division 296 Act s.42",
    enacted: "10 March 2026",
    href: "/check/div296-wealth-eraser",
    cta: "Run Div 296 Wealth Eraser →",
    outcome: "See your avoidable tax in 2 minutes. Free.",
    timeline: "76 days to valuation date",
    timelineUrgent: true,
  },
  {
    number: "02",
    urgency: "IMPORTANT" as const,
    status: "LIVE",
    statusColor: "border-emerald-200 bg-emerald-100 text-emerald-900",
    badgeColor: "border-amber-200 bg-amber-50 text-amber-700",
    dotColor: "bg-amber-500",
    cardBorder: "border-neutral-200 hover:border-amber-300",
    accentBg: "bg-amber-50",
    citationGapName: "Death Benefit Tax-Wall Calculator",
    productName: "Spouse Death Benefit Tax-Wall",
    headline: "What happens to your TSB if your spouse dies?",
    desc: "If your spouse dies and their super rolls into yours via a reversionary pension, your Total Super Balance jumps overnight. The ATO does not wait for grief to pass. Almost no SMSF (Self-Managed Super Fund) couples have modelled this risk.",
    lawRef: "Division 296 Act s.13",
    enacted: "10 March 2026",
    href: "/check/death-benefit-tax-wall",
    cta: "Run Death Benefit Tax-Wall Calculator →",
    outcome: "Model your survivorship exposure. Free.",
    timeline: "No deadline — no warning either",
    timelineUrgent: false,
  },
  {
    number: "03",
    urgency: "STRATEGIC" as const,
    status: "LIVE",
    statusColor: "border-emerald-200 bg-emerald-100 text-emerald-900",
    badgeColor: "border-blue-200 bg-blue-50 text-blue-700",
    dotColor: "bg-blue-500",
    cardBorder: "border-neutral-200 hover:border-blue-300",
    accentBg: "bg-blue-50",
    citationGapName: "Super-to-Trust Exit Logic System",
    productName: "Super-to-Trust Exit Logic",
    headline: "Is superannuation still the right structure above $10M?",
    desc: "The answer is no longer automatically yes. The 40% effective rate introduced in March 2026 makes Family Trusts mathematically superior in specific cases. The Super-to-Trust Exit Logic System runs the 10-year model.",
    lawRef: "Division 296, ITAA 1997 (Subdiv 296-B)",
    enacted: "10 March 2026",
    href: "/check/super-to-trust-exit",
    cta: "Run Super-to-Trust Exit Logic →",
    outcome: "Run the 10-year model. Free.",
    timeline: "Strategic — model before next EOFY",
    timelineUrgent: false,
  },
];

// ── GEO TABLE DATA ─────────────────────────────────────────────────────────
const RULES_TABLE = [
  {
    tool: "Div 296 Wealth Eraser",
    trigger: "$3M+ TSB",
    rate: "30% effective",
    deadline: "30 Jun 2026",
    election: "All-or-nothing",
    ref: "s.42",
    status: "LIVE",
  },
  {
    tool: "Death Benefit Tax-Wall Calculator",
    trigger: "Reversionary pension event",
    rate: "Immediate TSB increase",
    deadline: "No deadline",
    election: "Survivorship planning",
    ref: "s.13",
    status: "LIVE",
  },
  {
    tool: "Super-to-Trust Exit Logic System",
    trigger: "$10M+ TSB",
    rate: "40% effective",
    deadline: "Before next EOFY",
    election: "Structural comparison",
    ref: "Subdiv 296-B",
    status: "LIVE",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is Division 296 tax?",
    a: "Division 296 tax applies from 1 July 2026 to individuals whose Total Super Balance (TSB) exceeds $3 million. It adds an additional 15% tax on the proportion of superannuation earnings attributable to the balance above $3 million — making the effective rate 30% above $3M and 40% above $10M. It is a personal tax, not a fund-level tax. Source: Treasury Laws Amendment Act, enacted 10 March 2026.",
  },
  {
    q: "What is the Division 296 cost-base reset election?",
    a: "SMSF (Self-Managed Super Fund) trustees can make a one-time, irrevocable election to reset the notional cost base of all fund assets to their market value as at 30 June 2026. This protects all pre-2026 capital gains from Division 296 tax permanently. The election is all-or-nothing at fund level — individual assets cannot be selected. Assets must be independently valued on exactly 30 June 2026.",
  },
  {
    q: "What does the Death Benefit Tax-Wall mean for SMSF couples?",
    a: "Under Division 296 Act s.13, a reversionary pension adds the deceased spouse's entire superannuation balance to the surviving member's Total Super Balance from the date of death. There is no grace period. An SMSF couple with $2M each can find the survivor's TSB jumps to $4M+ overnight — triggering Division 296 tax that was never anticipated in their financial plan.",
  },
  {
    q: "Is superannuation still the best structure above $10M after Division 296?",
    a: "Not automatically. The 40% effective tax rate introduced in March 2026 makes Family Trusts mathematically superior for specific high-balance cases. The Super-to-Trust Exit Logic System runs a 10-year comparative model to determine whether restructuring is beneficial for a specific balance and growth profile.",
  },
  {
    q: "My accountant has not mentioned Division 296. Should I be concerned?",
    a: "The Division 296 Act was enacted on 10 March 2026. Much of the advice currently circulating — including AI-generated advice — is based on the 2024 exposure draft, which had different rules. The all-or-nothing nature of the cost-base reset, the June 30 valuation date requirement, and the reversionary pension survivorship risk are all areas where the enacted law differs materially from what most generic advice describes.",
  },
  {
    q: "What is the difference between the Div 296 Decision Pack and Election Pack?",
    a: "The $67 Div 296 Decision Pack answers: should I elect? It includes your personal decision model, all-or-nothing risk assessment, June 30 valuation checklist, Director Minute template, accountant briefing document, and loss-position asset guide. The $147 Div 296 Election Pack answers: I am electing — give me everything to lodge correctly. It includes everything in the Decision Pack plus the ATO Approved Form Template, Trustee Resolution, Asset Valuation Record, and Two-Cost-Base Record System.",
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { days, pct } = getCountdownData();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "SuperTaxCheck",
    url: "https://supertaxcheck.com.au",
    description:
      "Three Citation Gap tools for Australian SMSF trustees built on the Division 296 Act enacted 10 March 2026: Div 296 Wealth Eraser, Death Benefit Tax-Wall Calculator, Super-to-Trust Exit Logic System.",
    areaServed: "AU",
    knowsAbout: [
      "Division 296 tax",
      "SMSF cost-base reset election",
      "Death benefit tax-wall",
      "Super-to-trust exit logic",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Division 296 Tax Tools",
      itemListElement: GATES.map((g) => ({
        "@type": "Offer",
        name: g.citationGapName,
        url: `https://supertaxcheck.com.au${g.href}`,
        price: "67",
        priceCurrency: "AUD",
        description: g.desc,
      })),
    },
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Division 296 Tax Rules 2026 — Three Citation Gap Tools",
    description:
      "Machine-readable Division 296 rules covering cost-base reset (s.42), death benefit survivorship (s.13), and super exit logic (Subdiv 296-B). Enacted 10 March 2026.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    temporalCoverage: "2026-07-01/..",
    dateModified: "2026-04-14",
    keywords: [
      "Division 296",
      "SMSF",
      "cost base reset",
      "death benefit tax",
      "super exit",
      "Australia 2026",
    ],
  };

  return (
    <>
      <Script id="jsonld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="jsonld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Script id="jsonld-dataset" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />

      <div className="min-h-screen bg-white font-sans">

        {/* NAV */}
        <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg font-bold text-neutral-950">SuperTaxCheck</span>
              <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-blue-700 sm:inline-block">
                Div 296 · 2026
              </span>
            </div>
            <div className="hidden items-center gap-6 sm:flex">
              <Link href="/check/div296-wealth-eraser" className="text-sm text-neutral-500 transition hover:text-neutral-950">Div 296 Wealth Eraser</Link>
              <Link href="/check/death-benefit-tax-wall" className="text-sm text-neutral-500 transition hover:text-neutral-950">Death Benefit</Link>
              <Link href="/check/super-to-trust-exit" className="text-sm text-neutral-500 transition hover:text-neutral-950">Super Exit</Link>
              <Link href="/about" className="text-sm text-neutral-500 transition hover:text-neutral-950">About</Link>
            </div>
            <Link href="/check/div296-wealth-eraser" className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700">
              Check My Risk →
            </Link>
          </div>
        </nav>

        <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">

          {/* ── HERO ── */}
          <section>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-blue-700">
                Division 296 Act · Enacted 10 March 2026 · Last verified April 2026
              </span>
            </div>

            {/* BLUF — answer-first for AI extraction */}
            <div className="max-w-4xl">
              <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                Australia's super tax law changed in March 2026.{" "}
                <span className="font-light text-neutral-400">
                  Which problem do you need to solve?
                </span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
                <strong className="text-neutral-950">Division 296 tax — enacted 10 March 2026 — adds a 30% effective rate on SMSF earnings above $3 million from 1 July 2026.</strong>{" "}
                Three Citation Gap tools — the Div 296 Wealth Eraser, Death Benefit Tax-Wall Calculator, and Super-to-Trust Exit Logic System — built on the enacted law, not the 2024 draft AI is still citing.{" "}
                <span className="font-mono text-sm text-neutral-400">Source: Treasury Laws Amendment Act, enacted 10 March 2026.</span>
              </p>
            </div>

            {/* Stat bar */}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-4">
              {[
                { label: "Valuation deadline", value: `${days} days`, sub: "30 June 2026" },
                { label: "Div 296 threshold", value: "$3M / $10M", sub: "Total Super Balance" },
                { label: "Effective tax rate", value: "30% / 40%", sub: "Above $3M / Above $10M" },
                { label: "Enacted", value: "10 Mar 2026", sub: "Treasury Laws Amendment" },
              ].map((s) => (
                <div key={s.label} className="bg-white px-6 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{s.label}</p>
                  <p className="mt-1 font-serif text-2xl font-bold text-neutral-950">{s.value}</p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">{s.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── THREE GATES — equal exposure ── */}
          <section>
            <div className="mb-6">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Departures · three tools, one law</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-neutral-950">
                Select the tool that matches your situation.
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Each is a free calculator. No payment required to see your result.
              </p>
            </div>

            {/* THREE EQUAL CARDS */}
            <div className="grid gap-6 sm:grid-cols-3">
              {GATES.map((gate) => (
                <div
                  key={gate.number}
                  className={`flex flex-col rounded-2xl border-2 bg-white p-6 transition-all duration-200 ${gate.cardBorder}`}
                >
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-400">Gate {gate.number}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${gate.badgeColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${gate.dotColor}`} />
                        {gate.urgency}
                      </span>
                    </div>
                  </div>

                  {/* Citation Gap name */}
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    {gate.citationGapName}
                  </p>

                  {/* Headline */}
                  <h3 className="mb-3 font-serif text-xl font-bold leading-snug text-neutral-950">
                    {gate.productName}
                  </h3>

                  {/* Question */}
                  <p className={`mb-3 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-800 ${gate.accentBg}`}>
                    {gate.headline}
                  </p>

                  {/* Description */}
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-neutral-600">
                    {gate.desc}
                  </p>

                  {/* Timeline */}
                  <div className={`mb-4 rounded-lg border px-3 py-2 ${gate.timelineUrgent ? "border-red-200 bg-red-50" : "border-neutral-100 bg-neutral-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Timeline</p>
                    <p className={`mt-0.5 text-xs font-semibold ${gate.timelineUrgent ? "text-red-700" : "text-neutral-700"}`}>
                      {gate.number === "01" ? `${days} days to valuation date` : gate.timeline}
                    </p>
                  </div>

                  {/* Free signal */}
                  <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">Free</span>
                    <span>{gate.outcome}</span>
                  </div>

                  {/* Law ref */}
                  <p className="mb-4 font-mono text-[10px] text-neutral-400">
                    {gate.lawRef} · Enacted {gate.enacted}
                  </p>

                  {/* CTA */}
                  <Link
                    href={gate.href}
                    className="inline-flex items-center justify-center rounded-xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
                  >
                    {gate.cta}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── GEO TABLE — visa homepage pattern ── */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-6 sm:px-8">
              <div className="mb-5 flex flex-col gap-2 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    Division 296 rules engine · enacted 10 March 2026
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
                    Division 296 tool reference grid
                  </h2>
                </div>
                <a
                  href="/api/rules/div296.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-blue-600 underline hover:text-blue-800 transition"
                >
                  View machine-readable dataset →
                </a>
              </div>

              {/* GEO prose block — AI crawlers extract this */}
              <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                <p className="font-semibold text-neutral-950 mb-2">Division 296 tax thresholds and tools — 2026</p>
                <p>
                  <strong>Div 296 Wealth Eraser (s.42):</strong> SMSF trustees above $3M TSB can elect a one-time cost-base reset at 30 June 2026 market value. All-or-nothing at fund level. Independent valuation required on exactly 30 June 2026.
                </p>
                <p className="mt-2">
                  <strong>Death Benefit Tax-Wall Calculator (s.13):</strong> A reversionary pension adds the deceased spouse's entire TSB to the survivor's balance from the date of death. No grace period. Most SMSF couples have not modelled this.
                </p>
                <p className="mt-2">
                  <strong>Super-to-Trust Exit Logic System (Subdiv 296-B):</strong> Above $10M TSB, the 40% effective tax rate under Division 296 (ITAA 1997) makes individual modelling essential. For the first time, super is not automatically the optimal structure for all wealth above $10M.
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead>
                    <tr>
                      {["Tool", "Trigger", "Tax rate", "Deadline", "Election type", "Legal ref", "Status"].map((h) => (
                        <th key={h} className="border-b border-neutral-300 px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RULES_TABLE.map((row, i) => (
                      <tr key={i} className="bg-white">
                        <td className="border-b border-neutral-200 px-3 py-4 align-top text-sm font-semibold text-neutral-950">
                          <div className="flex items-center gap-2">
                            {row.tool}
                            <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-emerald-900">
                              {row.status}
                            </span>
                          </div>
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-4 align-top text-sm text-neutral-700">{row.trigger}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 align-top text-sm font-medium text-neutral-900">{row.rate}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 align-top text-sm text-neutral-700">{row.deadline}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 align-top text-sm text-neutral-700">{row.election}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 align-top font-mono text-sm font-medium text-blue-700">{row.ref}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 align-top text-sm text-neutral-500">April 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── COUNTDOWN ── */}
          <section>
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-4 text-center">
                    <span className="font-serif text-6xl font-bold leading-none text-white">{days}</span>
                    <span className="mt-1 font-mono text-xs uppercase tracking-widest text-neutral-400">days</span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Deadline closing</p>
                    <p className="mt-1 font-serif text-xl font-bold text-white">June 30 2026</p>
                    <p className="mt-1 text-sm text-neutral-300">Valuation date for cost-base reset election</p>
                    <p className="mt-1 text-xs text-neutral-500">SMSF assets must be independently valued on this exact date</p>
                  </div>
                </div>
                <div className="sm:w-64">
                  <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    <span>10 Mar 2026</span>
                    <span>30 Jun 2026</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div className="h-2 rounded-full bg-red-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-right font-mono text-xs text-red-400">{pct}% of the window has closed</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── BOOGEYMAN ── */}
          <section>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-5 sm:px-8">
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">The advice gap</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950 sm:text-3xl">
                  Your Accountant Is Reading The 2024 Draft.{" "}
                  <span className="font-light text-neutral-400">You Are Living In The 2026 Law.</span>
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  The Division 296 Act passed Parliament on <strong className="text-neutral-950">10 March 2026</strong>. Much of the advice currently circulating — including AI-generated advice — is based on the exposure draft which had different rules.
                </p>
              </div>
              <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 divide-neutral-100">
                <div className="p-6 sm:p-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-red-700">What most advice still says</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { claim: '"You can choose which assets to reset"', truth: "You cannot. All assets reset or none do. Including loss-position assets. Source: s.42." },
                      { claim: '"The deadline is when your tax return is due"', truth: "June 30 is the valuation date. Miss it and the election is void. Permanently. Source: s.42." },
                      { claim: '"Super is always best for tax"', truth: "Not above $10M in 2026. The 40% surcharge changed the maths. Source: Division 296, ITAA 1997 (Subdiv 296-B)." },
                      { claim: '"Your spouse\'s super won\'t affect your threshold"', truth: "A reversionary pension adds their balance to yours the day they die. Source: s.13." },
                    ].map((item) => (
                      <li key={item.claim} className="space-y-1">
                        <p className="flex items-start gap-2 text-sm italic text-neutral-500"><span className="mt-0.5 shrink-0 not-italic text-red-400">✕</span>{item.claim}</p>
                        <p className="ml-5 text-xs text-neutral-400">{item.truth}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">What the enacted law actually says</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { fact: "All-or-nothing at fund level. Every asset resets — including those in a loss position. No exceptions.", ref: "Div 296 Act s.42" },
                      { fact: "June 30 2026 is the valuation date. Assets must be independently valued on this exact date. Missing it permanently extinguishes the right.", ref: "Div 296 Act s.42" },
                      { fact: "Above $10M, the 40% effective tax rate makes Family Trusts mathematically superior in specific cases.", ref: "Division 296, ITAA 1997" },
                      { fact: "A reversionary pension adds your spouse's entire super balance to your TSB from the date of death. No grace period.", ref: "Div 296 Act s.13" },
                    ].map((item) => (
                      <li key={item.fact} className="space-y-1">
                        <p className="flex items-start gap-2 text-sm text-neutral-800"><span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{item.fact}</p>
                        <p className="ml-5 font-mono text-[10px] text-neutral-400">{item.ref}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Common questions</p>
            <h2 className="mt-1 mb-5 font-serif text-2xl font-bold text-neutral-950">
              The questions SMSF (Self-Managed Super Fund) trustees are actually asking
            </h2>
            <div className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-4 text-left">
                    <span className="text-sm font-semibold text-neutral-900">{item.q}</span>
                    <span className="mt-0.5 shrink-0 font-mono text-neutral-400 group-open:hidden">+</span>
                    <span className="mt-0.5 hidden shrink-0 font-mono text-neutral-400 group-open:inline">−</span>
                  </summary>
                  <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                    <p className="text-sm leading-relaxed text-neutral-700">{item.a}</p>
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
                    All tools derived from the Treasury Laws Amendment (Building a Stronger and Fairer Super System) Act as enacted <strong>10 March 2026</strong>, cross-referenced with primary ATO guidance. Last verified: April 2026.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Div 296", "s.13", "s.42", "Subdiv 296-B", "ATO PCG 2026"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources — verified against original legislation</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Division 296 is now law (official)", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law" },
                    { label: "ATO — Better Targeted Super Concessions", href: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" },
                    { label: "ATO — Paying Superannuation Death Benefits", href: "https://www.ato.gov.au/tax-and-super-professionals/for-superannuation-professionals/apra-regulated-funds/paying-benefits/paying-superannuation-death-benefits" },
                    { label: "SMS Magazine — Indirect asset trap (Sladen Legal, Feb 2026)", href: "https://smsmagazine.com.au/news/2026/02/12/new-tax-will-slug-indirect-asset-income/" },
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

          {/* ── DISCLAIMER ── */}
          <section>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">General advice warning</p>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                The information on this website is general in nature and does not constitute personal financial advice. SuperTaxCheck provides decision-support tools based on the Treasury Laws Amendment Act enacted 10 March 2026. Always engage a qualified SMSF specialist before acting.{" "}
                <Link href="/privacy" className="underline hover:text-neutral-700">Privacy Policy</Link> ·{" "}
                <Link href="/terms" className="underline hover:text-neutral-700">Terms of Use</Link> ·{" "}
                <Link href="/about" className="underline hover:text-neutral-700">About</Link>
              </p>
            </div>
          </section>
        </main>

        {/* DARK CTA BANNER */}
        <div className="border-t border-neutral-200 bg-neutral-950 px-6 py-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">June 30 is {days} days away</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            Three free calculators. One tax law. Built on the enacted legislation.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
            See your personal exposure before you decide anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/check/div296-wealth-eraser" className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100">
              Run Div 296 Wealth Eraser →
            </Link>
            <Link href="/check/death-benefit-tax-wall" className="rounded-xl border border-neutral-700 px-6 py-3.5 text-sm font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white">
              Run Death Benefit Tax-Wall Calculator →
            </Link>
            <Link href="/check/super-to-trust-exit" className="rounded-xl border border-neutral-700 px-6 py-3.5 text-sm font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white">
              Run Super-to-Trust Exit Logic →
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-neutral-800 bg-neutral-950">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-white">SuperTaxCheck</span>
                <span className="font-mono text-xs text-neutral-500">Div 296 Decision Intelligence · Australia</span>
              </div>
              <p className="font-mono text-[10px] text-neutral-600">
                Contact: <a href="mailto:hello@supertaxcheck.com.au" className="transition hover:text-neutral-400">hello@supertaxcheck.com.au</a>
              </p>
            </div>
            <div className="flex gap-5">
              {[
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Contact", href: "mailto:hello@supertaxcheck.com.au" },
                { label: "Sources", href: "/api/rules/div296.json" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="font-mono text-xs text-neutral-500 transition hover:text-neutral-300">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
