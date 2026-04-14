import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import DeathBenefitTaxWallCalculator from "./DeathBenefitTaxWallCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Death Benefit Tax-Wall Calculator | SuperTaxCheck",
  description:
    "Adult children pay 17% tax on the taxable component of your SMSF when you die. On a $2M SMSF with 80% taxable component that is $272,000 going to the ATO — not your family. Free calculator. Built on ITAA 1997 and Division 296 Act s.13.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/death-benefit-tax-wall",
  },
  openGraph: {
    title: "Death Benefit Tax-Wall Calculator | SuperTaxCheck",
    description:
      "Your children will pay up to $272,000 tax on your SMSF when you die. Most trustees don't know this. Free calculator shows your exact tax wall.",
    url: "https://supertaxcheck.com.au/check/death-benefit-tax-wall",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

// ── GEO DATA ───────────────────────────────────────────────────────────────
const taxRatesTable = [
  {
    recipient: "Spouse / de facto partner",
    taxStatus: "Tax dependant",
    taxablePct: "0%",
    taxFreePct: "0%",
    notes: "Fully tax-free regardless of component split",
  },
  {
    recipient: "Child under 18",
    taxStatus: "Tax dependant",
    taxablePct: "0%",
    taxFreePct: "0%",
    notes: "Tax-free. Pension must cease at age 25 unless disability.",
  },
  {
    recipient: "Adult child (18+, financially independent)",
    taxStatus: "NOT a tax dependant",
    taxablePct: "17% (15% + 2% Medicare)",
    taxFreePct: "0%",
    notes: "Most common situation. 70-90% of SMSF is typically taxable.",
  },
  {
    recipient: "Adult child via estate (not direct)",
    taxStatus: "NOT a tax dependant",
    taxablePct: "15% (no Medicare levy)",
    taxFreePct: "0%",
    notes: "Routing via estate saves 2% Medicare levy.",
  },
  {
    recipient: "Adult child — untaxed element (insurance)",
    taxStatus: "NOT a tax dependant",
    taxablePct: "32% (30% + 2% Medicare)",
    taxFreePct: "0%",
    notes: "Applies where fund claimed tax deduction on insurance premium. Member under 65 at death.",
  },
];

const workedExample = {
  balance: "$2,000,000",
  taxableComponent: "$1,600,000",
  taxFreeComponent: "$400,000",
  numChildren: 2,
  totalTax: "$272,000",
  perChild: "$136,000",
  familyKeeps: "$1,728,000",
  atoTakes: "$272,000",
  recontributionSaving: "$51,000",
  recontributionAmount: "$300,000",
};

const aiErrors = [
  {
    wrong: '"Your super passes to your children tax-free"',
    correct:
      "Only to tax dependants. Adult children over 18 who are financially independent pay 17% (15% + 2% Medicare) on the taxable component. On a $2M SMSF with 80% taxable component: $272,000 to the ATO.",
    ref: "ITAA 1997, ATO death benefit guidance",
  },
  {
    wrong: '"A Binding Death Benefit Nomination protects your children from tax"',
    correct:
      "A BDBN controls who receives the benefit — not the tax on it. Adult children still pay 17% on the taxable component regardless of a valid BDBN. A BDBN also expires every 3 years unless your deed allows non-lapsing nominations.",
    ref: "SIS Regulations, ITAA 1997",
  },
  {
    wrong: '"Super law and tax law define dependants the same way"',
    correct:
      "Two completely different definitions. Under the SIS Act (super law), adult children CAN receive a death benefit directly. Under the ITAA (tax law), adult children are NOT tax dependants and pay 17% tax on the taxable component. Conflating these two definitions is the most expensive mistake in SMSF estate planning.",
    ref: "SIS Act + ITAA 1997",
  },
  {
    wrong: '"Your Will covers your superannuation"',
    correct:
      "Superannuation is NOT an estate asset. It is not covered by your Will unless you nominate your Legal Personal Representative (executor) as the beneficiary — which then allows your Will to direct the proceeds. Without a valid BDBN or LPR nomination, the remaining SMSF trustee has full discretion.",
    ref: "SIS Act, ATO SMSF guidance",
  },
];

const faqs = [
  {
    question:
      "I thought superannuation passed to my children tax-free when I die. Is that right?",
    answer:
      "Only if your children are tax dependants under tax law. An adult child over 18 who is financially independent is NOT a tax dependant — regardless of your relationship or how much you love them. They pay 17% tax (15% plus 2% Medicare levy) on the taxable component of your SMSF (Self-Managed Super Fund). On a $2M SMSF with 80% taxable component, that is $272,000 going to the ATO — not your children. This is the most widespread misconception in Australian SMSF estate planning. Source: ITAA 1997.",
  },
  {
    question:
      "What is the difference between who can receive my super and who gets it tax-free?",
    answer:
      "Two completely different laws apply — and this is where most families get hurt. Under the SIS Act (superannuation law): adult children CAN receive a death benefit directly from the fund. Under the ITAA (tax law): adult children are NOT tax dependants and pay 17% tax on the taxable component. Most people assume that because their children can receive the benefit, they receive it tax-free. They cannot. The two definitions are not the same. Source: SIS Act + ITAA 1997.",
  },
  {
    question:
      "I have a Binding Death Benefit Nomination to my adult children. Does that protect them from tax?",
    answer:
      "No. A BDBN controls who receives the benefit — not the tax on it. A BDBN nominating two adult children on a $2M SMSF still results in $272,000 in tax. The BDBN ensures they receive the benefit. It does not reduce the tax. A standard BDBN also expires every 3 years — an expired nomination is treated as if no nomination exists, giving the remaining trustee full discretion. Check whether your SMSF trust deed allows a non-lapsing BDBN. Source: SIS Regulations.",
  },
  {
    question:
      "What percentage of my SMSF is the taxable component?",
    answer:
      "The taxable component is built from employer contributions (SG), salary sacrifice, and investment earnings in accumulation phase. The tax-free component comes only from personal after-tax (non-concessional) contributions. Most SMSF members who have been employed for 30+ years have 70-90% taxable component. On a $2M SMSF at 80% taxable: $1.6M is exposed to the 17% death benefit tax wall for adult children. To find yours: ask your SMSF accountant for your member statement showing the component split. Source: ITAA 1997 proportioning rule.",
  },
  {
    question:
      "What is the recontribution strategy and can I still do it?",
    answer:
      "The recontribution strategy involves withdrawing super (tax-free over 60) and recontributing it as a non-concessional (after-tax) contribution. This converts taxable component to tax-free component — directly reducing the death benefit tax for adult children. Example: withdraw $300,000 tax-free, recontribute as non-concessional. Result: $300,000 converts from taxable to tax-free. Tax saving for adult children: $51,000 (17% of $300,000). Eligibility requires: over 60 (so withdrawals are tax-free), still eligible to contribute (under 75, work test if 67-74), and TSB allows non-concessional contributions ($1.9M cap). Source: ATO recontribution guidance.",
  },
  {
    question:
      "Does starting a pension lock in my taxable component?",
    answer:
      "Yes — and this is a critical timing issue. Once a pension commences, the proportions of taxable and tax-free component are frozen. Future investment earnings do not increase the taxable component in pension phase. This means the most efficient recontribution must happen before pension commencement — or at least before the pension phase proportions freeze. A $2M SMSF that starts pension with 80% taxable will have that 80% proportion locked in for the life of the pension, regardless of future contributions or withdrawals. Source: ITAA 1997 proportioning rule.",
  },
  {
    question:
      "My SMSF holds commercial property. What happens if my children can't pay the 17% tax?",
    answer:
      "One of the most dangerous situations in SMSF estate planning. Example: John dies. $1.5M SMSF comprising one commercial property leased to the family business. Two adult children as beneficiaries. Tax bill: $204,000 (17% of $1.2M taxable component). No cash in the fund. Property cannot be split. Result: the property must be sold to pay the tax bill — disrupting the family business, incurring CGT, and potentially stamp duty on transfer. Check your SMSF trust deed NOW for in-specie transfer provisions. Consider insurance inside the fund for liquidity. Source: SIS Act, ATO SMSF guidance.",
  },
  {
    question:
      "My Will leaves everything to my children equally. Does that include my super?",
    answer:
      "No. Superannuation is NOT an estate asset. It is not covered by your Will unless you specifically nominate your Legal Personal Representative (LPR/executor) as the beneficiary — which then allows your Will to direct the proceeds. Without a valid BDBN or LPR nomination, the remaining SMSF trustee has full discretion over who receives the benefit — which may not match your Will. Routing through the estate also saves 2% Medicare levy: the rate drops from 17% to 15%. On $1.2M taxable component that is $24,000 saved. Source: SIS Act.",
  },
  {
    question:
      "When does the 32% tax rate apply?",
    answer:
      "The 32% rate (30% + 2% Medicare levy) applies only to the untaxed element of a death benefit paid directly to a non-dependant. The untaxed element arises when: (1) life insurance inside the fund pays out, (2) the fund claimed a tax deduction on the insurance premium, and (3) the deceased was under 65 at death. For most SMSFs without insurance death benefits, the relevant rate is 17% on the taxable taxed element. Paid via estate: 15% (no Medicare). Example: $500,000 insurance payout, untaxed element, adult child beneficiary — $160,000 tax bill directly, $150,000 via estate. Source: ITAA 1997.",
  },
  {
    question:
      "What if my SMSF has individual (not corporate) trustees?",
    answer:
      "In an individual trustee SMSF, the surviving spouse — as remaining trustee — has the legal power to pay the entire death benefit to themselves, even if the deceased intended to leave some to the children. This is one of the most common sources of family disputes in SMSF administration. A corporate trustee provides better protection. A valid non-lapsing BDBN removes trustee discretion entirely. An invalid or expired BDBN is treated as no nomination at all. Source: SIS Act s.17A.",
  },
  {
    question:
      "How long does the SMSF have to pay out the death benefit?",
    answer:
      "The ATO expects death benefits to be paid as soon as practicable — generally within six months. Failure to meet this expectation can trigger auditor contraventions and ATO scrutiny. For illiquid asset funds (property), the six-month expectation creates real pressure to sell quickly — often at below market value. A fund forced to sell a $1.5M commercial property in three months may accept $150,000-$300,000 below market value — on top of the $204,000 death benefit tax bill. Planning the asset structure NOW avoids this forced sale. Source: SIS Act, ATO guidance.",
  },
  {
    question:
      "Does Division 296 make the death benefit tax-wall worse?",
    answer:
      "Yes — significantly. From 2026-27, SMSF members above $3M face Div 296 tax on earnings (30% effective rate) PLUS the death benefit tax-wall on their children's inheritance. A $3M SMSF with 80% taxable component faces: Div 296 tax approximately $13,500 per year on earnings above $3M threshold, AND death benefit tax: $408,000 on death ($2.4M taxable × 17%). Total compounding tax burden over 10 years: $135,000+ in Div 296 PLUS $408,000 death benefit tax = $543,000 leaving the family. These two problems compound together — and most SMSF families have modelled neither. Source: Division 296 Act s.13, enacted 10 March 2026 + ITAA 1997.",
  },
];

export default function DeathBenefitTaxWallPage() {
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
    name: "SMSF Death Benefit Tax Rates and Rules 2026",
    description:
      "Machine-readable SMSF death benefit tax rates for dependants and non-dependants, including recontribution strategy rules and Division 296 survivorship risk. Source: ITAA 1997 and Division 296 Act s.13.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    dateModified: "2026-04-14",
    keywords: ["SMSF death benefit tax", "adult children super tax", "death benefit tax-wall", "recontribution strategy", "taxable component"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Death Benefit Tax-Wall Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/death-benefit-tax-wall",
    description:
      "Free calculator showing the SMSF death benefit tax exposure for adult children and the Division 296 survivorship risk for surviving spouses. Built on ITAA 1997 and Division 296 Act s.13.",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    offers: [
      { "@type": "Offer", price: "67", priceCurrency: "AUD", name: "Death Benefit Tax-Wall Decision Pack" },
      { "@type": "Offer", price: "147", priceCurrency: "AUD", name: "Death Benefit Tax-Wall Planning Pack" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to calculate your SMSF death benefit tax-wall",
    description: "Calculate the tax your adult children will pay on your SMSF when you die, and the Division 296 survivorship risk if your partner dies first.",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Enter your super balance", text: "Add up your total super across all accounts.", position: 1 },
      { "@type": "HowToStep", name: "Enter your taxable component percentage", text: "Most SMSF members: 70-90%. Check your member statement. Defaults to 80%.", position: 2 },
      { "@type": "HowToStep", name: "Select number of adult children beneficiaries", text: "Adult children over 18 who are financially independent — these are non-dependants under tax law.", position: 3 },
      { "@type": "HowToStep", name: "Enter your partner's super balance", text: "Their total across all super accounts.", position: 4 },
      { "@type": "HowToStep", name: "Select pension type", text: "Whether your partner's pension is reversionary — this determines whether it adds to your Total Super Balance immediately on their death.", position: 5 },
      { "@type": "HowToStep", name: "Review your two risk panels", text: "Panel 1 shows the death benefit tax your children will pay if you die. Panel 2 shows the Div 296 survivorship risk if your partner dies.", position: 6 },
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
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="font-mono text-xs font-bold text-amber-600">Gate 02 · Death Benefit Tax-Wall</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12">

          {/* ── HERO ── */}
          <section className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-700">
                  Death Benefit Tax-Wall Calculator · Gate 02 · Important
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Your adult children will pay up to{" "}
              <span className="text-red-600">$272,000</span>{" "}
              tax on your SMSF.{" "}
              <span className="font-light text-neutral-400">Most trustees don't know this.</span>
            </h1>

            {/* BLUF — answer-first GEO extraction paragraph */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">
                Adult children over 18 who are financially independent are NOT tax dependants under tax law.
              </strong>{" "}
              They pay <strong className="text-neutral-950">17% tax</strong> (15% plus 2% Medicare levy) on the taxable
              component of your SMSF (Self-Managed Super Fund) when you die. On a $2M SMSF with 80% taxable component
              — which is typical after 30+ years of employer contributions — that is{" "}
              <strong className="text-neutral-950">$272,000 going to the ATO, not your family.</strong>{" "}
              Most of it is avoidable. The window to act is open right now.{" "}
              <span className="font-mono text-sm text-neutral-400">Source: ITAA 1997.</span>
            </p>

            {/* AI drift warning */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700">What AI gets wrong about this</p>
              <p className="mt-1 text-sm text-amber-900">
                Most AI tools say super passes tax-free to children.{" "}
                <strong>It does not.</strong> Only to tax dependants under the ITAA. Adult children are not tax dependants.
                A Binding Death Benefit Nomination controls who gets the benefit — not the tax on it.
                Your Will does not cover your super unless you nominate your executor as beneficiary.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <DeathBenefitTaxWallCalculator />

              {/* RIGHT: Source + facts */}
              <div className="space-y-4">

                {/* Tax rates quick reference */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
                    Death benefit tax rates — quick reference
                  </p>
                  <div className="space-y-2">
                    {[
                      { who: "Spouse / partner", rate: "0%", color: "text-emerald-700" },
                      { who: "Child under 18", rate: "0%", color: "text-emerald-700" },
                      { who: "Adult child (18+)", rate: "17%", color: "text-red-700" },
                      { who: "Adult child via estate", rate: "15%", color: "text-amber-700" },
                      { who: "Adult child (insurance)", rate: "32%", color: "text-red-700" },
                    ].map((row) => (
                      <div key={row.who} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <p className="text-xs text-neutral-700">{row.who}</p>
                        <p className={`font-mono text-sm font-bold ${row.color}`}>{row.rate}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-400">
                    Source: ITAA 1997 · Last verified {lastVerified}
                  </p>
                </div>

                {/* Div 296 countdown */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    Also relevant — Div 296 deadline
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-white">{days}</span>
                    <span className="font-mono text-xs text-neutral-400">days to June 30 2026</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    If you also have a Div 296 exposure, the cost-base reset election deadline is June 30.
                  </p>
                  <Link
                    href="/check/div296-wealth-eraser"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-blue-400 hover:text-blue-300 transition underline"
                  >
                    Run Div 296 Wealth Eraser →
                  </Link>
                </div>

                {/* Products */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Two products</p>
                  <div className="mb-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">What is my exposure and can I reduce it?</p>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Planning Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500">Give me everything to fix this.</p>
                  </div>
                </div>

                {/* Dataset link */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Legal basis</p>
                  <div className="space-y-1 text-xs text-blue-900">
                    <p><strong>ITAA 1997</strong> — death benefit tax rates</p>
                    <p><strong>SIS Act</strong> — who can receive benefits</p>
                    <p><strong>Div 296 Act s.13</strong> — survivorship risk</p>
                    <p>Enacted: 10 March 2026</p>
                  </div>
                  <a
                    href="/api/rules/div296.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:text-blue-800 transition underline"
                  >
                    View machine-readable dataset →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── TAX RATES TABLE — GEO gold ── */}
          <section className="mb-12">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                SMSF death benefit tax rates — full reference
              </p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
                Who pays tax on your SMSF when you die — and how much
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead>
                    <tr>
                      {["Recipient", "Tax status", "Tax on taxable component", "Tax on tax-free", "Notes"].map((h) => (
                        <th key={h} className="border-b border-neutral-300 px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {taxRatesTable.map((row, i) => (
                      <tr key={i} className="bg-white">
                        <td className="border-b border-neutral-200 px-3 py-4 text-sm font-semibold text-neutral-950">{row.recipient}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 text-sm text-neutral-700">{row.taxStatus}</td>
                        <td className={`border-b border-neutral-200 px-3 py-4 font-mono text-sm font-bold ${row.taxablePct === "0%" ? "text-emerald-700" : "text-red-700"}`}>{row.taxablePct}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 font-mono text-sm text-emerald-700">{row.taxFreePct}</td>
                        <td className="border-b border-neutral-200 px-3 py-4 text-xs text-neutral-500">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 font-mono text-[10px] text-neutral-400">
                Source: ITAA 1997, ATO death benefit guidance · Last verified: {lastVerified}
              </p>
            </div>
          </section>

          {/* ── WORKED EXAMPLE ── */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
              Worked example: how the death benefit tax-wall is calculated
            </h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500 mb-4">
                Anne, 68. SMSF (Self-Managed Super Fund) balance: {workedExample.balance}.
                Employer contributions and investment growth built up over 35 years of employment.
                Two adult children, ages 38 and 41. Neither is financially dependent on Anne.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                {[
                  { label: "SMSF balance", value: workedExample.balance },
                  { label: "Taxable component (80%)", value: workedExample.taxableComponent },
                  { label: "Tax-free component (20%)", value: workedExample.taxFreeComponent },
                  { label: "Total tax to ATO", value: workedExample.totalTax, highlight: true },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.highlight ? "border-red-200 bg-red-50" : "border-neutral-100 bg-neutral-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{item.label}</p>
                    <p className={`mt-1 font-serif text-xl font-bold ${item.highlight ? "text-red-700" : "text-neutral-950"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-red-600">Tax per child</p>
                  <p className="mt-1 font-serif text-xl font-bold text-red-700">{workedExample.perChild}</p>
                  <p className="text-xs text-red-600">{workedExample.totalTax} ÷ 2 children</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">Family keeps</p>
                  <p className="mt-1 font-serif text-xl font-bold text-emerald-700">{workedExample.familyKeeps}</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Recontribution saving</p>
                  <p className="mt-1 font-serif text-xl font-bold text-blue-700">{workedExample.recontributionSaving}</p>
                  <p className="text-xs text-blue-600">If {workedExample.recontributionAmount} recontributed</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-900">
                  <strong>The calculation:</strong> $1,600,000 (taxable component) × 17% (15% + 2% Medicare) = $272,000 total tax.
                  Via estate instead of direct: $1,600,000 × 15% = $240,000 — saving $32,000 by routing through the estate.
                </p>
              </div>
              <p className="mt-3 font-mono text-[10px] text-neutral-400">
                Source: ITAA 1997 proportioning rule · Last verified: {lastVerified}
              </p>
            </div>
          </section>

          {/* ── AI DRIFT ── */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-4">
              What AI gets wrong about SMSF death benefits
            </h2>
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
              SMSF death benefit tax-wall — the questions trustees actually ask
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

          {/* ── LAW BAR ── */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-blue-600">Legislative source verification</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-blue-900">
                  Death benefit tax rates derived from the Income Tax Assessment Act 1997. Survivorship risk derived from Division 296 Act s.13, enacted <strong>10 March 2026</strong>. Last verified: {lastVerified}.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ITAA 1997", "SIS Act", "Div 296 s.13", "ATO guidance"].map((ref) => (
                  <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                ))}
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
                <a key={link.label} href={link.href} className="font-mono text-xs text-neutral-400 transition hover:text-neutral-700">
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
