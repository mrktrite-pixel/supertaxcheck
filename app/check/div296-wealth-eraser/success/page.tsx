import Link from "next/link";
import { getCountdownData } from "@/lib/countdown";

type PageProps = {
  searchParams: Promise<{
    tier?: string;
    payment?: string;
    session_id?: string;
  }>;
};

// ── PRODUCT CONFIGS ────────────────────────────────────────────────────────

const DECISION_PACK_67 = {
  tier: 67,
  name: "Div 296 Decision Pack",
  tagline: "Should I elect? And if so, how?",
  headline: "Your Decision Pack is ready.",
  subheadline: "Everything you need to make the right call before June 30.",
  nextAction: "Start with File 01. Work through in order. Each file answers one question.",
  files: [
    {
      num: "01",
      title: "Your Personal Reset vs. No-Reset Decision Model",
      desc: "A personalised analysis of whether the cost-base reset is right for YOUR fund. Uses your balance, cost base, and market value to model both outcomes side by side.",
      action: "Read this first. It is the core decision.",
    },
    {
      num: "02",
      title: "All-or-Nothing Risk Assessment",
      desc: "A structured review of the all-or-nothing rule. Identifies which of your assets are in a gain position and which are in a loss position — and what happens to each under the election.",
      action: "Complete before making any decision.",
    },
    {
      num: "03",
      title: "June 30 Valuation Checklist",
      desc: "Exactly what needs to be independently valued on 30 June 2026, how to engage a valuer, and what documentation is required for the election to be valid.",
      action: "Engage your valuer immediately using this checklist.",
    },
    {
      num: "04",
      title: "Director Minute Template",
      desc: "A ready-to-sign Director Minute documenting your trustees' decision — whether you elect or decide not to. Required for SMSF governance regardless of which way you go.",
      action: "Complete after your decision. Sign before June 30.",
    },
    {
      num: "05",
      title: "Briefing Document for Your SMSF Accountant",
      desc: "A plain-language brief covering what Division 296 means for your fund, what the cost-base reset election involves, and what your accountant needs to action before June 30.",
      action: "Send to your accountant now.",
    },
    {
      num: "06",
      title: "Loss-Position Asset Guide",
      desc: "Specifically addresses assets that are currently worth less than their purchase price. Explains the reset impact on these assets and whether they change the overall decision.",
      action: "Review if any SMSF assets have dropped in value.",
    },
  ],
  upsell: {
    title: "Ready to lodge? Upgrade to the Election Pack.",
    desc: "When you have decided to elect, the $147 Election Pack gives you the ATO Approved Form, Trustee Resolution, Asset Valuation Record, and Two-Cost-Base Record System.",
    href: "/check/div296-wealth-eraser",
    cta: "Run the calculator again to get the Election Pack →",
  },
};

const ELECTION_PACK_147 = {
  tier: 147,
  name: "Div 296 Election Pack",
  tagline: "Everything to lodge the cost-base reset election correctly.",
  headline: "Your Election Pack is ready.",
  subheadline: "All 10 files. Work through in order. Lodge before June 30.",
  nextAction: "Start with File 01. Complete Files 01-06 to confirm your decision, then use Files 07-10 to lodge.",
  files: [
    {
      num: "01",
      title: "Your Personal Reset vs. No-Reset Decision Model",
      desc: "A personalised analysis of whether the cost-base reset is right for YOUR fund — confirms you are making the right call before you lodge the irrevocable election.",
      action: "Confirm your decision with this first.",
    },
    {
      num: "02",
      title: "All-or-Nothing Risk Assessment",
      desc: "A structured review of which assets are in a gain and which are in a loss position — and the impact of resetting all of them simultaneously.",
      action: "Review all assets before lodging.",
    },
    {
      num: "03",
      title: "June 30 Valuation Checklist",
      desc: "Exactly what needs to be independently valued on 30 June 2026, how to engage a valuer, and what documentation is required for the election to be valid.",
      action: "Engage your valuer immediately.",
    },
    {
      num: "04",
      title: "Director Minute Template",
      desc: "A ready-to-sign Director Minute documenting the trustees' decision to make the cost-base reset election.",
      action: "Sign before lodging.",
    },
    {
      num: "05",
      title: "Briefing Document for Your SMSF Accountant",
      desc: "A plain-language brief covering what your accountant needs to do before and after June 30 — including what to include in the 2026-27 SMSF annual return.",
      action: "Send to your accountant now.",
    },
    {
      num: "06",
      title: "Loss-Position Asset Guide",
      desc: "Addresses assets currently worth less than their purchase price and their impact on the election decision.",
      action: "Review if any assets have dropped in value.",
    },
    {
      num: "07",
      title: "ATO Approved Form Template",
      desc: "The actual cost-base reset election form, pre-structured and ready to complete. Includes field-by-field completion guidance based on your specific fund details.",
      action: "Complete and lodge with your 2026-27 SMSF annual return.",
    },
    {
      num: "08",
      title: "Trustee Resolution",
      desc: "A formal resolution to be signed by all trustees (or the corporate trustee director) documenting the fund's decision to make the election. Required for SMSF governance.",
      action: "All trustees sign this before June 30.",
    },
    {
      num: "09",
      title: "Asset Valuation Record",
      desc: "A template for recording the market value of each SMSF asset as at 30 June 2026. Must be retained for a minimum of 5 years under the enacted legislation.",
      action: "Complete with your valuer on 30 June 2026.",
    },
    {
      num: "10",
      title: "Two-Cost-Base Record System",
      desc: "A structured system for tracking two separate cost bases for each SMSF asset — one for normal income tax purposes and one for Division 296 purposes — as required by the enacted legislation.",
      action: "Set up immediately after lodging. Maintain ongoing.",
    },
  ],
};

// ── PAGE ───────────────────────────────────────────────────────────────────
export default async function SuccessPage({ searchParams }: PageProps) {
  const { tier, payment, session_id } = await searchParams;
  const { days } = getCountdownData();

  const isElection = tier === "147";
  const config = isElection ? ELECTION_PACK_147 : DECISION_PACK_67;
  const isPaid = payment === "success" && Boolean(session_id);

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Access required</p>
          <h1 className="font-serif text-2xl font-bold text-neutral-950">
            This page requires a completed purchase.
          </h1>
          <p className="text-sm text-neutral-600">
            If you have completed payment and landed here, please contact us at{" "}
            <a href="mailto:hello@supertaxcheck.com.au" className="underline">
              hello@supertaxcheck.com.au
            </a>{" "}
            and we will send your pack immediately.
          </p>
          <Link href="/check/div296-wealth-eraser" className="inline-block rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700">
            Run the calculator →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAV */}
      <nav className="border-b border-neutral-200 bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-serif text-lg font-bold text-neutral-950">SuperTaxCheck</Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs text-neutral-400 sm:block">
              {config.name}
            </span>
            <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">
              ← All tools
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">

        {/* HEADER */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-lg">
              ✓
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                Payment confirmed · {config.name}
              </p>
              <h1 className="mt-1 font-serif text-3xl font-bold text-neutral-950">
                {config.headline}
              </h1>
              <p className="mt-2 text-base text-neutral-600">{config.subheadline}</p>
            </div>
          </div>
        </div>

        {/* DEADLINE REMINDER */}
        <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="text-center">
            <p className="font-serif text-3xl font-bold text-red-700">{days}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-red-500">days</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-900">June 30 2026 is the valuation date.</p>
            <p className="text-xs text-red-700">
              SMSF (Self-Managed Super Fund) assets must be independently valued on this exact date. Work through your pack now.
            </p>
          </div>
        </div>

        {/* NEXT ACTION */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Where to start</p>
          <p className="font-serif text-xl font-bold text-neutral-950">{config.nextAction}</p>
        </div>

        {/* FILES — story format */}
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            Your {config.files.length} files — work through in order
          </p>

          {config.files.map((file, i) => {
            const isAdvanced = isElection && parseInt(file.num) > 6;
            return (
              <div
                key={file.num}
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isAdvanced
                    ? "border-blue-200 bg-blue-50"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${
                    isAdvanced
                      ? "bg-blue-100 text-blue-700"
                      : "bg-neutral-100 text-neutral-700"
                  }`}>
                    {file.num}
                  </div>
                  <div className="flex-1">
                    {isAdvanced && (
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-blue-600">
                        Election Pack exclusive
                      </p>
                    )}
                    <h3 className="font-serif text-lg font-bold text-neutral-950">
                      {file.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {file.desc}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-medium text-neutral-600">
                        Action
                      </span>
                      <p className="text-xs font-semibold text-neutral-700">{file.action}</p>
                    </div>
                  </div>
                  <div className={`hidden shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest sm:flex ${
                    i === 0 ? "border-red-200 bg-red-50 text-red-700" : "border-neutral-200 bg-neutral-50 text-neutral-500"
                  }`}>
                    {i === 0 ? "Start here" : `Step ${parseInt(file.num)}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* UPSELL — only on $67 */}
        {!isElection && (
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-blue-700 mb-1">
              When you are ready to lodge
            </p>
            <h3 className="font-serif text-xl font-bold text-neutral-950">
              {DECISION_PACK_67.upsell.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">{DECISION_PACK_67.upsell.desc}</p>
            <Link
              href={DECISION_PACK_67.upsell.href}
              className="mt-4 inline-flex items-center gap-1 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              {DECISION_PACK_67.upsell.cta}
            </Link>
          </div>
        )}

        {/* LAW BAR */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600">Legislative basis</p>
          <p className="mt-1 text-xs text-blue-900">
            All documents derived from Division 296 Act s.42 — Treasury Laws Amendment (Building a Stronger and Fairer Super System) Act, enacted 10 March 2026. Last verified April 2026.
          </p>
        </div>

        {/* DISCLAIMER */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">General advice warning</p>
          <p className="text-xs leading-relaxed text-neutral-500">
            This pack is a decision-support tool based on Division 296 Act s.42 enacted 10 March 2026. It does not constitute financial, legal, or tax advice. The cost-base reset election is irrevocable. Always engage a qualified SMSF (Self-Managed Super Fund) specialist before lodging.
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Questions? <a href="mailto:hello@supertaxcheck.com.au" className="underline hover:text-neutral-700">hello@supertaxcheck.com.au</a>
          </p>
        </div>

        <div className="text-center">
          <Link href="/check/div296-wealth-eraser" className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition">
            ← Run another calculation
          </Link>
        </div>
      </main>
    </div>
  );
}
