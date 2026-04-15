import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import DeathBenefitTaxWallCalculator from "./DeathBenefitTaxWallCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "Super Death Benefit Tax Calculator — What Your Kids Actually Inherit | SuperTaxCheck",
  description:
    "When you die, your adult kids do not just inherit your super. They inherit a tax bill. On most funds, around 80% of the balance gets taxed at 17% before your kids see a dollar. On a $2M fund that is $272,000 to the ATO. Free calculator shows your number.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/death-benefit-tax-wall",
  },
  openGraph: {
    title: "Super Death Benefit Tax — What Your Kids Actually Inherit",
    description: "On a $2M super fund, your adult kids pay $272,000 tax before they see a dollar. Most people do not know this. Free calculator. 2 minutes.",
    url: "https://supertaxcheck.com.au/check/death-benefit-tax-wall",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

// ── DATA ───────────────────────────────────────────────────────────────────

const taxRatesTable = [
  { recipient: "Your spouse or partner", rate: "0%", colour: "emerald", notes: "Married or de facto — same rule. Tax-free regardless." },
  { recipient: "Your kids under 18", rate: "0%", colour: "emerald", notes: "Tax-free while under 18." },
  { recipient: "Your adult kids (18+)", rate: "17%", colour: "red", notes: "17% on the taxable part. This is where the tax wall is." },
  { recipient: "Adult kids via your estate", rate: "15%", colour: "amber", notes: "Routing through your Will saves the 2% Medicare levy." },
  { recipient: "Adult kids (insurance payout)", rate: "32%", colour: "red", notes: "If the fund claimed a tax deduction on the insurance premium and you were under 65." },
];

const accountantQuestions = [
  {
    q: "What is the taxable component of my super right now — in actual dollars, not a percentage?",
    why: "Most people have 70-90% taxable component built up from employer contributions over their working life. On a $2M fund at 80% taxable, that is $1.6M exposed to the 17% tax. You need the dollar figure to understand what your kids are actually facing.",
  },
  {
    q: "Have we done a recontribution strategy to reduce the taxable part?",
    why: "If you are over 60, you can withdraw super tax-free and recontribute it as after-tax money — converting taxable to tax-free. This directly reduces what the ATO takes from your kids. Many people who could do this have never been told about it.",
  },
  {
    q: "Is my Binding Death Benefit Nomination still valid — and does it expire?",
    why: "A standard nomination expires every 3 years. An expired nomination means the trustee decides who gets your super — which may not be your kids. And even a valid nomination does not reduce the 17% tax. Two separate problems.",
  },
  {
    q: "Does my super go through my Will when I die, or directly from the fund?",
    why: "Super is not automatically covered by your Will. If it goes directly from the fund to your adult kids, they pay 17%. If it goes through your estate first, they pay 15% — saving 2% on the taxable amount. On $1.6M taxable, that is $32,000 difference.",
  },
  {
    q: "If my partner and I both have super and one of us dies — what happens to the survivor's tax situation?",
    why: "This is the Div 296 survivorship risk. If your partner's super rolls to you automatically when they die, your total balance jumps — potentially over the $3 million threshold. The new tax then applies. Most couples have not modelled this.",
  },
];

const deadlineItems = [
  {
    when: "Right now",
    what: "Check your taxable component — ask your accountant",
    consequence: "You cannot plan what you cannot measure. Get the dollar figure. Not a percentage. The actual dollar amount your kids will pay tax on.",
    urgent: true,
  },
  {
    when: "Before you turn 75",
    what: "Last chance for the recontribution strategy",
    consequence: "You must be under 75 to make non-concessional contributions. If you are 68-74, the work test may apply. The window closes permanently at 75.",
    urgent: true,
  },
  {
    when: "Before June 30 2026",
    what: "Div 296 survivorship risk — if your combined super exceeds $3M",
    consequence: "If your partner's super would push your balance over $3 million when they die, the new Division 296 tax applies. The cost-base reset on Gate 01 can help — but only before June 30.",
    urgent: true,
  },
  {
    when: "Every 3 years",
    what: "Renew your Binding Death Benefit Nomination",
    consequence: "A standard BDBN expires every 3 years. Check when yours was last signed. An expired nomination gives the trustee full discretion over your super.",
    urgent: false,
  },
  {
    when: "When your circumstances change",
    what: "Update your nomination after divorce, remarriage, or a child turns 18",
    consequence: "Many people have nominations that no longer reflect their wishes. A nomination to a former spouse can still be valid. Review it now.",
    urgent: false,
  },
];

const faqs = [
  {
    question: "My super goes to my kids when I die — does that mean they get it tax-free?",
    answer: "No — and this is the most common thing people get wrong about super. Your adult kids (over 18, financially independent) are not tax dependants under tax law. They pay 17% tax — 15% plus 2% Medicare levy — on the taxable part of your super. On a $2M fund where 80% is taxable, that is $272,000 going to the ATO before your kids see a dollar. Your spouse or partner pays nothing. Your kids under 18 pay nothing. But your adult kids pay 17%. Source: ITAA 1997.",
  },
  {
    question: "We are not officially married — does that change anything for my partner?",
    answer: "No — de facto partners are treated exactly the same as married spouses under tax law. This includes same-sex couples and long-term partners who are not legally married. Your de facto partner pays zero tax on your super when you die. This has been the law since 2008. The key is that your partner qualifies as a de facto — meaning you live together as a genuine couple on a domestic basis. You do not need to be living together every single day — FIFO workers and long-distance couples can still qualify. What matters is the nature of the relationship, not the number of nights under the same roof. Courts look at the full facts: shared finances, mutual support, how you present as a couple. If there is any doubt, your SMSF should have the relationship documented — a statutory declaration helps. Your SMSF accountant or adviser can assist. Source: ITAA 1997 s.302-195, SIS Act s.10, ATO ID 2011/83.",
  },
  {
    question: "What is the taxable part of my super and how much of mine is taxable?",
    answer: "Your super has two parts — taxable and tax-free. The taxable part is built up from employer contributions, salary sacrifice, and earnings in accumulation phase. The tax-free part comes only from personal after-tax contributions you made yourself. Most people who worked for 30+ years and had compulsory super going in have 70-90% taxable. On a $2M fund at 80% taxable — that is $1.6M exposed to the 17% tax when you die. To find your exact split, ask your accountant for your member statement showing the component breakdown. Source: ITAA 1997 proportioning rule.",
  },
  {
    question: "What is the recontribution strategy and is it too late for me to do it?",
    answer: "The recontribution strategy is the main way to reduce this tax. It works like this: if you are over 60, you can withdraw super tax-free, then put it back in as an after-tax contribution. That money is now in the tax-free component. When you die, your kids pay no tax on the tax-free part. Example: withdraw $300,000, recontribute as non-concessional. Tax saving for your kids: $51,000 (17% of $300,000). To be eligible you need to be over 60, under 75, and have a total balance under $1.9M to make full contributions. The window closes permanently when you can no longer contribute. Source: ATO recontribution guidance.",
  },
  {
    question: "I have a Binding Death Benefit Nomination. Does that protect my kids from tax?",
    answer: "No — a BDBN controls who gets your super, not the tax on it. A valid BDBN naming your two adult kids on a $2M fund means they definitely receive the benefit. But they still pay $272,000 in tax on it. The BDBN is important for control. It is not a tax strategy. It also expires every 3 years unless your trust deed allows a non-lapsing nomination. An expired BDBN gives the trustee full discretion — which in a single-trustee fund often means the surviving spouse. Source: SIS Regulations.",
  },
  {
    question: "Does my Will cover my super?",
    answer: "No — and this catches a lot of people out. Super is not an estate asset. It sits outside your Will unless you specifically nominate your executor (Legal Personal Representative) as the beneficiary. If you do that, your super goes through your estate and your Will can direct it. There is also a tax benefit to routing through your estate — adult kids pay 15% instead of 17% because the Medicare levy does not apply to estate payments. On $1.6M taxable that is $32,000 saved. But it adds a step and can delay payment. Source: SIS Act.",
  },
  {
    question: "My fund holds a commercial property. What happens if my kids cannot pay the tax?",
    answer: "This is one of the hardest situations in SMSF planning. Example: John dies. His $1.5M fund is mostly a commercial property leased to the family business. His two adult kids are the nominated beneficiaries. Tax bill: $204,000 (17% of $1.2M taxable). The fund has no cash. The property cannot be split. The fund must sell the property to pay the tax — disrupting the family business, potentially at a fire-sale price, with CGT on top. This is avoidable with forward planning — insurance inside the fund for liquidity, or in-specie transfers if the deed allows. Source: SIS Act, ATO guidance.",
  },
  {
    question: "If my partner dies first and their super comes to me — how does that affect me?",
    answer: "This is the Div 296 survivorship risk. If your partner has a reversionary pension — one that automatically continues to you when they die — their super balance adds to yours from the date of death. No grace period. If that pushes your combined balance over $3 million, the new Division 296 tax applies immediately. Example: you each have $2M. If your partner dies and their pension reverts to you, your balance jumps to $4M overnight. Div 296 then applies on earnings above $3M. Most couples have not modelled this. The calculator on this page shows both risks at once. Source: Division 296 Act s.13, enacted 10 March 2026.",
  },
  {
    question: "Does Division 296 make this problem worse?",
    answer: "Yes — it adds a second tax problem on top. From July 1 this year, if your super is over $3 million, you pay extra tax on the earnings above that while you are alive. Then when you die, your adult kids pay 17% on the taxable part. A $4.3M fund with 80% taxable: roughly $13,500 Div 296 tax per year on earnings above $3M, plus $584,000 death benefit tax when you die ($3.44M taxable × 17%). Over 10 years that is $135,000 in Div 296 plus $584,000 death benefit tax — over $719,000 leaving your family instead of your kids. These two problems compound together. Most people have not looked at both at once. Source: Division 296, ITAA 1997.",
  },
  {
    question: "My accountant hasn't mentioned any of this. Should I be worried?",
    answer: "The death benefit tax on adult children has been the law since 2007 — it is not new. But the Div 296 survivorship risk is new law from March 2026. Many accountants who see SMSF clients once a year at tax time may not have raised it yet. That is not negligence — it is timing. The best thing you can do right now is run the calculator on this page, see your numbers, and then take the five questions listed below to your next meeting. Source: ITAA 1997, Division 296 Act s.13.",
  },
];

const aiErrors = [
  {
    wrong: '"Your super passes to your kids tax-free when you die"',
    correct: "Only to tax dependants. Your partner pays zero. Your adult kids over 18 who are financially independent pay 17% — 15% plus 2% Medicare — on the taxable part. On a $2M fund at 80% taxable that is $272,000 to the ATO. The tax-free assumption is the most expensive mistake in SMSF estate planning.",
    ref: "ITAA 1997, ATO death benefit guidance",
    source: "https://www.ato.gov.au/tax-and-super-professionals/for-superannuation-professionals/apra-regulated-funds/paying-benefits/paying-superannuation-death-benefits",
  },
  {
    wrong: '"A Binding Death Benefit Nomination protects your kids from the tax"',
    correct: "A BDBN controls who gets the benefit — not the tax on it. Adult kids with a valid BDBN naming them still pay 17% on the taxable part. The BDBN is about control of distribution. It is not a tax reduction strategy. A BDBN also expires every 3 years unless the deed allows a non-lapsing nomination.",
    ref: "SIS Regulations, ITAA 1997",
    source: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/paying-smsf-benefits/death-of-an-smsf-member",
  },
  {
    wrong: '"Super law and tax law define dependants the same way"',
    correct: "Two completely different definitions — and conflating them is the most expensive mistake. Under super law (SIS Act), adult kids CAN receive the death benefit directly. Under tax law (ITAA 1997), adult kids are NOT tax dependants and pay 17%. Receiving it and receiving it tax-free are two completely different questions answered by two completely different laws.",
    ref: "SIS Act + ITAA 1997",
    source: "https://www.ato.gov.au/tax-and-super-professionals/for-superannuation-professionals/apra-regulated-funds/paying-benefits/paying-superannuation-death-benefits",
  },
  {
    wrong: '"Your Will covers your super"',
    correct: "Super is not an estate asset. It does not automatically go through your Will. Unless you nominate your executor as the beneficiary, the trustee decides. Without a valid BDBN the trustee has full discretion — which in many SMSFs means the surviving spouse gets everything, regardless of what your Will says about the kids.",
    ref: "SIS Act, ATO SMSF guidance",
    source: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/paying-smsf-benefits/death-of-an-smsf-member",
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────
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
    name: "SMSF Death Benefit Tax Rates 2026 — Dependants and Non-Dependants",
    description: "Machine-readable SMSF death benefit tax rates. Spouse/partner: 0%. Adult children 18+: 17% on taxable component. Via estate: 15%. Insurance/untaxed: 32%. Source: ITAA 1997.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    dateModified: "2026-04-15",
    keywords: ["SMSF death benefit tax", "adult children super tax", "17% super tax", "recontribution strategy", "de facto partner super", "death benefit tax-wall Australia"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Death Benefit Tax-Wall Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/death-benefit-tax-wall",
    description: "Free calculator showing what your adult kids will pay in tax on your super when you die — and what happens to your balance if your partner dies first. Built on ITAA 1997 and Division 296 Act s.13.",
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
    name: "How to calculate the death benefit tax your kids will pay on your super",
    description: "A free 2-minute calculator showing the tax your adult children will pay on your super when you die, and the Division 296 survivorship risk if your partner dies first.",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Enter your super balance", text: "Your total super across all accounts.", position: 1 },
      { "@type": "HowToStep", name: "Set your taxable component percentage", text: "Most people who worked for 30+ years have 70-90% taxable. Default is 80%. Check your member statement to confirm.", position: 2 },
      { "@type": "HowToStep", name: "Select number of adult kids as beneficiaries", text: "Adult kids over 18 who are financially independent — these are the ones who pay the 17% tax.", position: 3 },
      { "@type": "HowToStep", name: "Enter your partner's super balance", text: "Their total across all super accounts.", position: 4 },
      { "@type": "HowToStep", name: "Select pension type", text: "Whether your partner's pension automatically comes to you when they die — this affects the Div 296 survivorship calculation.", position: 5 },
      { "@type": "HowToStep", name: "See both results", text: "Panel 1: what your kids pay if you die. Panel 2: what happens to your balance if your partner dies first.", position: 6 },
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
                <span className="font-mono text-xs font-bold text-amber-600">Death Benefit Tax-Wall</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">

          {/* ── SECTION 1: HERO ── */}
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-700">
                  Death Benefit Tax-Wall · Important
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              When you die, your adult kids do not just inherit your super.{" "}
              <span className="font-light text-neutral-400">They inherit a tax bill too.</span>
            </h1>

            {/* "Your accountant hasn't called" moment */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Most people have never been told this.
              </p>
              <p className="text-sm text-amber-800">
                The death benefit tax on adult kids has been in the law since 2007. But most SMSF trustees have never seen the dollar figure for their own fund. This calculator shows you in 2 minutes. It also shows what happens to your balance if your partner dies first — which is a separate problem the new super tax law just made worse.
              </p>
            </div>

            {/* BLUF */}
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">On most super funds, around 70-90% of the balance is the taxable part.</strong>{" "}
              When you die, your adult kids pay 17% tax — 15% plus 2% Medicare — on that taxable part before they see a dollar.{" "}
              <strong className="text-neutral-950">On a $2M fund at 80% taxable, that is $272,000 to the ATO.</strong>{" "}
              Your partner pays nothing. Your kids under 18 pay nothing. But your adult kids pay 17%.{" "}
              This has been the law since 2007 and it is avoidable with the right planning — but only while the window is still open.{" "}
              <span className="font-mono text-sm text-neutral-400">Source: ITAA 1997.</span>
            </p>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <DeathBenefitTaxWallCalculator />

              {/* RIGHT: Sidebar */}
              <div className="space-y-4">

                {/* Tax rates quick ref */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Who pays what when you die</p>
                  <div className="space-y-2">
                    {taxRatesTable.map((row) => (
                      <div key={row.recipient} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <div>
                          <p className="text-xs font-semibold text-neutral-800">{row.recipient}</p>
                          <p className="text-[10px] text-neutral-400">{row.notes}</p>
                        </div>
                        <p className={`font-mono text-sm font-bold ml-3 shrink-0 ${row.colour === "emerald" ? "text-emerald-700" : row.colour === "red" ? "text-red-700" : "text-amber-700"}`}>{row.rate}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-400">Source: ITAA 1997 · {lastVerified}</p>
                </div>

                {/* Div 296 link */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Also — June 30 deadline</p>
                  <p className="mt-2 text-sm text-neutral-300">
                    If your combined super with your partner is over $3M, the new Div 296 tax adds a second problem. The cost-base reset deadline is June 30.
                  </p>
                  <p className="mt-2 font-serif text-3xl font-bold text-white">{days}</p>
                  <p className="font-mono text-xs text-neutral-400">days to June 30 2026</p>
                  <Link href="/check/div296-wealth-eraser" className="mt-3 inline-flex font-mono text-[10px] text-blue-400 hover:text-blue-300 transition underline">
                    Run Div 296 Wealth Eraser →
                  </Link>
                </div>

                {/* Two packs */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Two packs. One problem.</p>
                  <div className="mb-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">What is my number and can I reduce it?</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Your personal tax-wall calculation", "Recontribution strategy guide", "Component analysis checklist", "BDBN review guide", "Trust deed review checklist", "Brief for your accountant"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-neutral-100 pt-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Planning Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">Give me everything to fix this.</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Everything in the Decision Pack", "Recontribution implementation plan", "Non-concessional contribution schedule", "Super Testamentary Trust brief", "Two-problem tracker (Div 296 + death benefit)"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0 text-blue-500">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Legal */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Primary sources</p>
                  <div className="space-y-1">
                    <a href="https://www.ato.gov.au/tax-and-super-professionals/for-superannuation-professionals/apra-regulated-funds/paying-benefits/paying-superannuation-death-benefits" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Paying Superannuation Death Benefits ↗</a>
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/paying-smsf-benefits/death-of-an-smsf-member" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Death of an SMSF member ↗</a>
                    <a href="https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Division 296 (Div 296 s.13) ↗</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: PLAIN ENGLISH TRANSLATION ── */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Plain English — what this actually means</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
                Here is what happens to your super when you die — without the legal language.
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-neutral-700">
                <p>
                  <strong className="text-neutral-950">Gary and Sandra are retired.</strong> Both in their mid-60s. They have an SMSF with $2 million — a mix of shares and some cash. Gary has been the main earner. Most of his super came from 25 years of employer contributions. Their two kids, both adults with jobs of their own, are nominated to receive Gary's super when he dies.
                </p>
                <p>
                  What Gary and Sandra do not know: when Gary dies, their kids will not receive $2 million. They will receive $2 million minus a tax bill.
                </p>
                <p>
                  <strong className="text-neutral-950">Here is the maths.</strong> Of Gary's $2M, about 80% — $1.6 million — is the taxable part. That is the money that came in as employer contributions over his career. When his adult kids receive it, they pay 17% tax on $1.6 million. That is $272,000.
                </p>
                <p>
                  Sandra would pay nothing. If Sandra was the sole beneficiary she would get the full $2 million. But Gary wanted to leave something for the kids.
                </p>
                <p>
                  <strong className="text-neutral-950">The good news:</strong> Gary can reduce this. If he is over 60, he can withdraw some of his super tax-free and put it back in as after-tax money. That converts taxable to tax-free. If he withdraws $300,000 and recontributes it, the kids save $51,000 in tax on that amount. Done over a few years, the saving compounds.
                </p>
                <p>
                  <strong className="text-neutral-950">The bad news:</strong> this strategy has a window. Gary must be under 75 and eligible to contribute. If he waits, the window closes. And the proportions freeze when pension phase starts.
                </p>
                <p className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                  <strong className="text-neutral-950">Also — Sandra has a separate problem.</strong> If Sandra dies first and her super automatically comes to Gary (a reversionary pension), Gary's balance jumps to $4 million overnight. That puts him over the $3 million threshold for the new Div 296 tax. Two separate problems. The calculator on this page shows both.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: WHAT TO ASK YOUR ACCOUNTANT ── */}
          <section>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">Five questions to ask your accountant</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                Take these in. Or send them in an email today.
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                These five questions will tell you exactly where you stand and what — if anything — you can still do.
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
                  <strong>Tip:</strong> Save a copy of your calculator result and take it with you. Having the dollar figure in front of you — "$272,000 to the ATO" — makes the conversation real. It is much easier to get your accountant to prioritise this when they can see the number.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 4: DEADLINE TRACKER ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Key timing — what to do and when</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
              There is no single hard deadline for this — but some windows close permanently.
            </h2>
            <div className="space-y-3">
              {deadlineItems.map((item, i) => (
                <div key={i} className={`flex gap-4 rounded-xl border p-4 ${item.urgent ? "border-amber-200 bg-amber-50" : "border-neutral-200 bg-white"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${item.urgent ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-500"}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${item.urgent ? "text-amber-600" : "text-neutral-400"}`}>{item.when}</span>
                      {item.urgent && <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-amber-700">Act on this</span>}
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 mb-1">{item.what}</p>
                    <p className="text-xs text-neutral-500">{item.consequence}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 5: WORKED EXAMPLE ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Real numbers — how the tax is calculated</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              What $272,000 actually looks like on a typical fund.
            </h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500 mb-5">
                Anne, 68. Her husband passed away two years ago. She now has $2M in her SMSF and wants to leave it to her two adult children, aged 38 and 41. Neither child is financially dependent on Anne.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
                {[
                  { label: "Anne's super balance", value: "$2,000,000" },
                  { label: "Taxable part (80%)", value: "$1,600,000" },
                  { label: "Tax-free part (20%)", value: "$400,000" },
                  { label: "Tax bill for her kids", value: "$272,000", red: true },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.red ? "border-red-200 bg-red-50" : "border-neutral-100 bg-neutral-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.label}</p>
                    <p className={`font-serif text-xl font-bold ${item.red ? "text-red-700" : "text-neutral-950"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3 mb-4">
                {[
                  { label: "Per child (2 kids)", value: "$136,000", sub: "$272,000 ÷ 2", red: true },
                  { label: "Anne's family keeps", value: "$1,728,000", sub: "$2M minus $272,000 tax", green: true },
                  { label: "Saving from recontribution", value: "$51,000", sub: "If $300k recontributed while eligible", blue: true },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.red ? "border-red-200 bg-red-50" : item.green ? "border-emerald-200 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.label}</p>
                    <p className={`font-serif text-xl font-bold ${item.red ? "text-red-700" : item.green ? "text-emerald-700" : "text-blue-700"}`}>{item.value}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-sm text-neutral-700">
                  <strong className="text-neutral-950">The calculation:</strong> $1,600,000 taxable × 17% (15% + 2% Medicare) = $272,000 total tax. If Anne's kids receive via her estate instead of directly, the rate drops to 15% — saving $32,000. Source: ITAA 1997, ATO death benefit guidance.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: AI ERRORS ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">What most AI tools get wrong about this</p>
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
              Questions people actually ask about super and death benefits.
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
                Covers the June 30 deadline, the death benefit tax on your kids, and whether moving to a trust makes sense. Written the way a smart mate would explain it. Not a lawyer. Not an accountant.
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
                    Death benefit tax rates from Income Tax Assessment Act 1997. Div 296 survivorship risk from Division 296 Act s.13, enacted <strong>10 March 2026</strong>. De facto partner treatment confirmed: same as spouse since 2008. Last verified: {lastVerified}.
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-blue-500">
                    Note: Super law (SIS Act) and tax law (ITAA 1997) define dependants differently. Adult kids can receive a death benefit under super law but still pay 17% under tax law. Two separate laws. Two separate definitions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["ITAA 1997", "SIS Act", "Div 296 s.13", "ATO Verified"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Paying Superannuation Death Benefits (official)", href: "https://www.ato.gov.au/tax-and-super-professionals/for-superannuation-professionals/apra-regulated-funds/paying-benefits/paying-superannuation-death-benefits" },
                    { label: "ATO — Death of an SMSF member", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/paying-smsf-benefits/death-of-an-smsf-member" },
                    { label: "ATO — Division 296 (Div 296 survivorship risk s.13)", href: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" },
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
                The information on this page is general in nature and does not constitute personal financial, legal, or tax advice. SuperTaxCheck provides decision-support tools based on the Income Tax Assessment Act 1997 and Treasury Laws Amendment Act enacted 10 March 2026. Always engage a qualified SMSF specialist before acting.{" "}
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
