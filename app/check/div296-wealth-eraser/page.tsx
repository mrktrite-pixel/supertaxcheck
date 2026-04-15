import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Div296WealthEraserCalculator from "./Div296WealthEraserCalculator";
import { getCountdownData } from "@/lib/countdown";

export const metadata: Metadata = {
  title: "New Super Tax — June 30 Cost-Base Reset Calculator | SuperTaxCheck",
  description:
    "Before July 1, there is a one-time chance to lock in today's value on everything in your super fund. Miss June 30 and it is gone permanently. Free calculator shows what it is worth for your fund. Built on Division 296 Act s.42, enacted 10 March 2026.",
  alternates: {
    canonical: "https://supertaxcheck.com.au/check/div296-wealth-eraser",
  },
  openGraph: {
    title: "New Super Tax — June 30 Cost-Base Reset Calculator",
    description: "Find out what the June 30 deadline is worth for your super fund. Free. 2 minutes. No signup.",
    url: "https://supertaxcheck.com.au/check/div296-wealth-eraser",
    siteName: "SuperTaxCheck",
    type: "website",
  },
};

const lastVerified = "April 2026";

// ── DATA ───────────────────────────────────────────────────────────────────

const accountantQuestions = [
  {
    q: "Has my super fund done the June 30 cost-base reset — and should it?",
    why: "This is the most important question. Many accountants have not raised it with clients yet. If your fund has significant growth in any asset since you bought it, the answer matters a lot.",
  },
  {
    q: "What is the current market value of each asset in my fund, and what did we pay for it originally?",
    why: "You need both numbers to decide. The gap between what you paid and what it is worth today is what the new tax will eventually hit — unless you lock it in before June 30.",
  },
  {
    q: "Do I have any assets in the fund worth less than I paid for them?",
    why: "The reset applies to every asset — including the ones that have gone down. If you have a loss-position asset, resetting it locks in a lower cost base, which could mean more tax on that asset later. You need to know before you decide.",
  },
  {
    q: "If I do the reset, what does the valuation cost and who needs to do it?",
    why: "Assets must be independently valued on exactly 30 June 2026. For property in your fund, this means getting a valuer in. This costs money and takes time to organise. The sooner you know whether you are doing it, the better.",
  },
  {
    q: "What happens if I do nothing before June 30?",
    why: "Ask for the dollar figure. Not a percentage. Not 'it depends.' Ask your accountant to model what the new tax costs your fund over the next 10 years if you do not lock in today's values. That number tells you whether this matters for your fund.",
  },
];

const deadlineItems = [
  {
    when: "Right now",
    what: "Decide whether to get assets valued",
    consequence: "If you leave it too late, you cannot get a valuation done by June 30. Property valuers book out. Start the conversation now.",
    urgent: true,
  },
  {
    when: "Before June 30",
    what: "Get independent valuations on all SMSF assets",
    consequence: "If you want to do the reset, your assets must be valued at market price on exactly June 30. Not May. Not July. June 30.",
    urgent: true,
  },
  {
    when: "June 30, 2026",
    what: "The valuation date — hard deadline",
    consequence: "Miss this and the cost-base reset is gone permanently. There is no extension. No second chance. The right to lock in today's values is extinguished forever.",
    urgent: true,
  },
  {
    when: "When your 2026-27 tax return is due",
    what: "Lodge the formal election with the ATO",
    consequence: "This is when you formally tell the ATO you are opting in. But the valuation must already be done from June 30 — you cannot value the assets later and backdate it.",
    urgent: false,
  },
  {
    when: "July 1, 2026",
    what: "New super tax starts",
    consequence: "From this date, earnings on super balances above $3 million attract additional tax. This is when the reset starts protecting you — or when the missed opportunity starts costing you.",
    urgent: false,
  },
  {
    when: "2027-28 onwards",
    what: "ATO issues first Division 296 tax assessments",
    consequence: "The first bills arrive. If you did the reset, pre-2026 gains are protected. If you did not, every dollar of growth since you bought the asset is in the tax pool.",
    urgent: false,
  },
];

const faqs = [
  {
    question: "What is this June 30 deadline I keep hearing about?",
    answer: "Before June 30, you can lock in the current value of everything in your super fund as the starting point for the new tax. This means the new tax only applies to growth after June 30 — not the decades of growth already sitting in your fund. You can only do this once. And it applies to every asset in your fund — you cannot choose which ones. Miss June 30 and this option is gone permanently. Source: Division 296 Act s.42, enacted 10 March 2026.",
  },
  {
    question: "What is the new super tax and how much is it?",
    answer: "From July 1 this year, if your total super balance is over $3 million, the ATO takes an extra cut of the earnings above that. Not on the whole balance — just on the growth above $3 million. The additional rate is 15% on earnings between $3M and $10M — bringing the total to 30%. Above $10M it goes to 40%. On a $3.4M fund earning 7% a year, that is roughly $4,200 in extra tax annually. On a $6M fund it is closer to $31,500. Source: Division 296, ITAA 1997 (Subdiv 296-B), enacted 10 March 2026.",
  },
  {
    question: "Can I choose which assets to include in the reset?",
    answer: "No — and this catches a lot of people out. You either reset everything or reset nothing. Every asset in your fund resets — including the ones that have gone down in value since you bought them. If you have a property that has dropped, that asset's cost base also resets to the lower value. This makes the decision more complicated than it first sounds. Run the calculator to see how it nets out for your fund. Source: Division 296 Act s.42.",
  },
  {
    question: "My super fund has a commercial property. Does this affect me?",
    answer: "Probably yes — and property funds are often the ones where the reset matters most. If you bought a commercial property 15 years ago for $800,000 and it is now worth $2.4 million, that $1.6 million growth is sitting in your fund unprotected. The new tax will eventually hit a share of that gain when the property is sold. The reset locks in today's $2.4 million value so only future growth above that is taxed. But you need an independent valuation on exactly June 30. Source: Division 296 Act s.42, ATO guidance.",
  },
  {
    question: "Does the reset affect my normal tax or CGT?",
    answer: "No — and this is important. The reset is only for the new Division 296 tax. Your normal SMSF income tax and capital gains tax are completely unaffected. Your fund will keep two sets of cost base records — one for normal tax (unchanged) and one for the new tax (reset to June 30 values). You keep these records for 5 years. Source: Division 296 Act s.42.",
  },
  {
    question: "My fund is currently worth less than $3 million. Should I still do the reset?",
    answer: "Possibly yes — and this surprises people. The reset is available to any SMSF, even if no member is currently above $3 million. If your fund has significant unrealised gains and you expect your balance to grow above $3 million in coming years, locking in today's values now protects all that existing growth permanently. Talk to your accountant about whether your fund is likely to cross the threshold and whether the reset makes sense as forward protection. Source: ATO guidance, Division 296 Act s.42.",
  },
  {
    question: "What if I have assets in a unit trust inside my super fund?",
    answer: "This is a trap many funds do not know about. The reset only applies to assets held directly by your SMSF. If your fund holds assets through a unit trust or private company inside the fund, those assets cannot be reset. All the growth on those assets since you bought them stays fully exposed to the new tax when sold. If your fund holds property through a unit trust, you need to talk to your accountant urgently. Source: Sladen Legal, Phil Broderick, SMS Magazine, February 2026.",
  },
  {
    question: "How long do I have and what should I do right now?",
    answer: "You have until June 30 for the valuation — that is the hard deadline. For property in your fund, you should be organising a valuer now. Valuers book out and June 30 is busy. For shares and cash, valuation is straightforward on the day. The first thing to do is run the calculator on this page. It takes 2 minutes and shows you whether the reset is worth doing for your fund. Then take the result to your accountant.",
  },
];

const aiErrors = [
  {
    wrong: '"You can choose which assets to reset — just pick the ones that have gone up"',
    correct: "The reset is all-or-nothing at fund level. Every asset resets — including those worth less than you paid. You cannot pick and choose individual assets. This is the most common misunderstanding about how the reset works.",
    ref: "Division 296 Act s.42, enacted 10 March 2026",
    source: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions",
  },
  {
    wrong: '"The deadline is when your tax return is due — you have time"',
    correct: "The valuation date is June 30, 2026 — not the tax return date. Assets must be independently valued at market value on exactly June 30. The election is formally lodged later, but the valuation must happen on the day. Miss June 30 and the right is gone permanently — no extension.",
    ref: "Division 296 Act s.42, ATO guidance",
    source: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law",
  },
  {
    wrong: '"The reset triggers a capital gains tax event — avoid it"',
    correct: "The reset does not trigger a CGT event. It does not restart the 12-month clock for CGT discount eligibility. Normal SMSF tax is completely unaffected. The reset only applies to the new Division 296 tax calculation.",
    ref: "Division 296 Act s.42",
    source: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions",
  },
  {
    wrong: '"Only large funds over $10 million need to worry about this"',
    correct: "The new tax starts at $3 million per person. About 80,000 Australians are affected — most of them are not high-flying finance types. They are ex-miners, tradies, farmers, and small business owners who accumulated super through two decades of good earnings and compulsory contributions.",
    ref: "ATO, ASFA — Division 296 2026",
    source: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions",
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function Div296WealthEraserPage() {
  const { days, pct } = getCountdownData();

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
    name: "Division 296 Cost-Base Reset Rules 2026 — SMSF Trustees",
    description: "Machine-readable Division 296 cost-base reset election rules for Australian SMSF trustees. Valuation date June 30, 2026. All-or-nothing at fund level. Source: Division 296 Act s.42, enacted 10 March 2026.",
    url: "https://supertaxcheck.com.au/api/rules/div296.json",
    creator: { "@type": "Organization", name: "SuperTaxCheck", url: "https://supertaxcheck.com.au" },
    temporalCoverage: "2026-07-01/..",
    dateModified: "2026-04-15",
    keywords: ["Division 296", "cost base reset", "SMSF", "June 30 2026", "super tax 2026", "Div 296"],
  };

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Div 296 Wealth Eraser — June 30 Cost-Base Reset Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    url: "https://supertaxcheck.com.au/check/div296-wealth-eraser",
    description: "Free calculator showing what the June 30 2026 cost-base reset is worth for your SMSF. Built on Division 296 Act s.42, enacted 10 March 2026.",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "SuperTaxCheck" },
    offers: [
      { "@type": "Offer", price: "67", priceCurrency: "AUD", name: "Div 296 Decision Pack" },
      { "@type": "Offer", price: "147", priceCurrency: "AUD", name: "Div 296 Election Pack" },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to calculate what the June 30 cost-base reset is worth for your super fund",
    description: "A free 2-minute calculator showing how much Division 296 tax the June 30 cost-base reset can protect for your SMSF.",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Enter your total super balance", text: "Add up all your super across every account. Include both your accumulation balance and any pension phase accounts.", position: 1 },
      { "@type": "HowToStep", name: "Enter what your fund paid for its main asset", text: "The original purchase price your fund paid — for your property, shares, or other main investment.", position: 2 },
      { "@type": "HowToStep", name: "Enter what that asset is worth today", text: "Your best estimate of the current market value. For property, use a recent appraisal or comparable sales. For shares, use today's price.", position: 3 },
      { "@type": "HowToStep", name: "See your result", text: "The calculator shows how much growth is currently unprotected, how much Division 296 tax that growth could eventually cost, and how much the reset could save.", position: 4 },
      { "@type": "HowToStep", name: "Answer five quick questions", text: "Five questions that personalise which documents you receive based on your specific situation — whether you are still deciding or ready to act.", position: 5 },
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
                <span className="font-mono text-xs font-bold text-red-600">{days} days to June 30</span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">

          {/* ── SECTION 1: HERO ── */}
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-700">
                  June 30 deadline · {days} days remaining
                </span>
              </div>
              <span className="font-mono text-xs text-neutral-400">Last verified: {lastVerified}</span>
            </div>

            {/* BLUF — Gary's H1 */}
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Before July 1, there is a one-time chance to lock in today's value on your super fund.{" "}
              <span className="font-light text-neutral-400">Miss June 30 and it is gone permanently.</span>
            </h1>

            {/* "Your accountant hasn't called you" moment */}
            <div className="mt-5 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Your accountant probably hasn't called you about this yet.
              </p>
              <p className="text-sm text-amber-800">
                The new super tax law passed on 10 March 2026 — six weeks ago. Most accountants see their clients once a year at tax time. That meeting is probably months away. This calculator takes 2 minutes and tells you whether you need to pick up the phone — or whether they do.
              </p>
            </div>

            {/* BLUF paragraph — answer first */}
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-600">
              <strong className="text-neutral-950">From July 1, if your super is over $3 million, the ATO takes an extra cut of the earnings above that.</strong>{" "}
              But before June 30 you can lock in today's values across everything in your fund — so the new tax only applies to growth from here, not the decades of growth already sitting in there.{" "}
              The catch: it is a one-time decision, it applies to every asset in your fund, and{" "}
              <strong className="text-neutral-950">if you miss June 30 it is gone permanently.</strong>{" "}
              <span className="font-mono text-sm text-neutral-400">Source: Division 296 Act s.42, enacted 10 March 2026.</span>
            </p>

            {/* Two-column layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* LEFT: Calculator */}
              <Div296WealthEraserCalculator />

              {/* RIGHT: Sidebar */}
              <div className="space-y-4">

                {/* Countdown */}
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-red-600">June 30 valuation date</p>
                  <p className="mt-2 font-serif text-5xl font-bold text-red-700">{days}</p>
                  <p className="font-mono text-xs text-red-500">days remaining</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-red-200">
                    <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-red-400">{pct}% of the window has closed</p>
                  <p className="mt-3 text-xs leading-relaxed text-red-700">
                    Assets must be independently valued on exactly this date. Organise your valuer now — they book out.
                  </p>
                </div>

                {/* Two products */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Two packs. One decision.</p>
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                      <span className="text-sm font-semibold text-neutral-900">Decision Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">Should I do the reset? Help me decide.</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Your personal decision model", "All-or-nothing risk check", "June 30 valuation checklist", "Director Minute template", "Brief for your accountant", "Loss-position asset guide"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-neutral-100 pt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                      <span className="text-sm font-semibold text-neutral-900">Election Pack</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">I am doing the reset. Give me everything to lodge it correctly.</p>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {["Everything in the Decision Pack", "ATO Approved Form template", "Trustee Resolution", "Asset Valuation Record", "Two-Cost-Base Record System"].map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0 text-blue-500">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Legal */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Built on the actual law</p>
                  <p className="text-xs text-blue-900 mb-3">Not the 2024 draft. The law that passed Parliament on 10 March 2026.</p>
                  <div className="space-y-1">
                    <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Division 296 is now law ↗</a>
                    <a href="https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">ATO — Better Targeted Super Concessions ↗</a>
                    <a href="https://www.legislation.gov.au/latest/C2026A00013" target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] text-blue-700 underline hover:text-blue-900 transition">Treasury Laws Amendment Act 2026 — full text ↗</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: PLAIN ENGLISH TRANSLATION ── */}
          <section>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Plain English — what this actually means for you</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
                Here is what is going on, without the jargon.
              </h2>

              <div className="space-y-5 text-sm leading-relaxed text-neutral-700">
                <p>
                  <strong className="text-neutral-950">Gary is 64.</strong> He worked fly-in fly-out for 22 years. Good money. Compulsory super went in every fortnight. Never thought about it much. Now he is retired and his super fund — which his accountant set up 15 years ago — holds a commercial shed in Mackay worth $1.8 million and some shares. Total: $3.4 million.
                </p>
                <p>
                  From July 1 this year, Gary's fund will pay extra tax on the earnings above $3 million. Not a lot at first — maybe $3,000-4,000 a year. But if the fund keeps growing, that number grows too.
                </p>
                <p>
                  <strong className="text-neutral-950">Here is the thing Gary does not know yet:</strong> before June 30, he can lock in today's value of the shed — $1.8 million — as the starting point for the new tax. That means the new tax only applies to growth in the shed's value <em>after</em> June 30. The $1.1 million the shed has grown since Gary's fund bought it in 2011? Protected permanently.
                </p>
                <p>
                  If Gary does nothing — and his accountant has not called him — that $1.1 million in existing growth stays in the tax pool. When the shed is eventually sold, a share of that $1.1 million will attract the new tax. On a fund Gary's size, that is roughly <strong className="text-neutral-950">$16,500 in avoidable tax</strong> on the old growth alone.
                </p>
                <p>
                  The catch: Gary cannot just reset the shed. He has to reset everything in the fund — shares too. And the reset requires an independent valuation on exactly June 30. Not June 28. Not July 2. June 30.
                </p>
                <p className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                  <strong className="text-neutral-950">The bottom line:</strong> Run the calculator above. Enter your fund's rough numbers. It will tell you in 2 minutes whether this deadline matters for your fund — and by how much.
                </p>
              </div>
            </div>
          </section>


          {/* ── INLINE CTA — mobile fix ── */}
          <div className="flex justify-center">
            <a href="#calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50">
              ↓ Run the calculator for your fund — 2 minutes
            </a>
          </div>
          {/* ── SECTION 3: WHAT TO ASK YOUR ACCOUNTANT ── */}
          <section>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">Five questions to ask your accountant before June 30</p>
              <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                Take these questions to your next meeting.
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Or send them in an email today. These are the five questions that determine whether the June 30 deadline matters for your fund — and what to do about it.
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
                  <strong>Tip:</strong> Screenshot these questions or copy them into an email to your accountant today. You do not need to understand all the details — that is what they are paid for. You just need to know whether this matters for your fund before June 30.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 4: DEADLINE TRACKER ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Every deadline — in order</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
              What needs to happen and when.
            </h2>
            <div className="space-y-3">
              {deadlineItems.map((item, i) => (
                <div key={i} className={`flex gap-4 rounded-xl border p-4 ${item.urgent ? "border-red-200 bg-red-50" : "border-neutral-200 bg-white"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${item.urgent ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-500"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${item.urgent ? "text-red-600" : "text-neutral-400"}`}>{item.when}</span>
                      {item.urgent && <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-red-700">Action needed</span>}
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
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">Real numbers — how it works</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              What the reset is worth on a typical fund.
            </h2>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500 mb-5">
                Gary's fund has one main asset — a commercial property. Here is how the reset calculation works.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
                {[
                  { label: "Gary's total super balance", value: "$4,500,000" },
                  { label: "What the fund paid for the property", value: "$800,000" },
                  { label: "What it is worth today", value: "$2,400,000" },
                  { label: "Growth at risk without the reset", value: "$1,600,000", highlight: true },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.highlight ? "border-red-200 bg-red-50" : "border-neutral-100 bg-neutral-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.label}</p>
                    <p className={`font-serif text-xl font-bold ${item.highlight ? "text-red-700" : "text-neutral-950"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3 mb-4">
                {[
                  { label: "Gary's share of balance above $3M", value: "33%", sub: "($1.5M above threshold ÷ $4.5M total)" },
                  { label: "Eventual tax on old growth if no reset", value: "~$80,000", sub: "When the property is eventually sold", red: true },
                  { label: "That tax after the reset", value: "$0", sub: "Pre-June 30 growth is permanently protected", green: true },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.red ? "border-red-200 bg-red-50" : item.green ? "border-emerald-200 bg-emerald-50" : "border-neutral-100 bg-neutral-50"}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.label}</p>
                    <p className={`font-serif text-xl font-bold ${item.red ? "text-red-700" : item.green ? "text-emerald-700" : "text-neutral-950"}`}>{item.value}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-sm text-blue-900">
                  <strong>The reset saves Gary ~$80,000</strong> in future Division 296 tax on the growth that already happened. That is the value of locking in today's $2.4 million value before June 30. Source: Division 296 Act s.42, ATO guidance.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 6: WHAT AI GETS WRONG ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">What most AI tools get wrong about this</p>
            <h2 className="font-serif text-2xl font-bold text-neutral-950 mb-5">
              If you Googled this or asked ChatGPT — check these against what you were told.
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
                      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-2">The enacted law says</p>
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
              Questions people are actually asking about the June 30 deadline.
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

          {/* ── SECTION 8: PLAIN ENGLISH PAGE LINK ── */}
          <section>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                Want the full picture?
              </p>
              <h2 className="font-serif text-2xl font-bold text-white mb-3">
                We wrote a plain English guide to the new super tax. For you. Not your accountant.
              </h2>
              <p className="text-sm text-neutral-300 mb-5">
                Covers all three problems the new law creates — the June 30 deadline, what happens to your super when you die, and whether moving to a family trust makes sense. Written the way a smart mate would explain it over a beer. No jargon.
              </p>
              <Link
                href="/what-is-the-new-super-tax"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100"
              >
                Read the plain English guide →
              </Link>
              <p className="mt-3 font-mono text-[10px] text-neutral-500">Free. No email required.</p>
            </div>
          </section>


          {/* ── CROSS-NAVIGATION ── */}
          <section>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">Also on SuperTaxCheck</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/check/death-benefit-tax-wall"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">Gate 02</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">Death Benefit Tax-Wall</p>
                <p className="text-xs text-neutral-500">When you die, your adult kids pay 17% tax on most of your super before they see a dollar. Free calculator shows your number.</p>
              </Link>
              <Link href="/check/super-to-trust-exit"
                className="group rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-400 hover:shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-1">Gate 03</p>
                <p className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">Super-to-Trust Exit</p>
                <p className="text-xs text-neutral-500">Everyone is asking whether to move to a trust. The exit usually costs more than the tax you save. Run the 10-year model.</p>
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
                    All calculations derived from the Treasury Laws Amendment (Building a Stronger and Fairer Super System) Act, enacted <strong>10 March 2026</strong>. Cross-referenced with ATO primary guidance. Last verified: {lastVerified}.
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-blue-500">
                    Note: Advice published before 10 March 2026 may describe Division 296 as taxing unrealised gains. The enacted law taxes only realised earnings. Verified against ATO.gov.au.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Div 296 Act s.42", "SMSF", "CGT Reset", "ATO Verified"].map((ref) => (
                    <span key={ref} className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-blue-700">{ref}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-blue-100 pt-4 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Primary sources</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {[
                    { label: "ATO — Better Targeted Super Concessions (official)", href: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/superannuation/better-targeted-superannuation-concessions" },
                    { label: "ATO — Division 296 is now law", href: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/self-managed-super-funds-smsf/smsf-newsroom/better-targeted-super-concessions-is-law" },
                    { label: "Treasury Laws Amendment Act 2026 — full text", href: "https://www.legislation.gov.au/latest/C2026A00013" },
                    { label: "SMS Magazine — Indirect asset trap (Sladen Legal)", href: "https://smsmagazine.com.au/news/2026/02/12/new-tax-will-slug-indirect-asset-income/" },
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
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">General advice warning</p>
              <p className="text-xs leading-relaxed text-neutral-500">
                The information on this page is general in nature and does not constitute personal financial, legal, or tax advice. SuperTaxCheck provides decision-support tools based on the Treasury Laws Amendment Act enacted 10 March 2026. The cost-base reset election is irrevocable. Always engage a qualified SMSF specialist before making any decision.{" "}
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
