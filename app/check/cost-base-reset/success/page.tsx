"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface SessionData {
  cost_base?: number;
  market_value?: number;
  total_balance?: number;
  asset_type?: string;
  member_count?: string;
  email?: string;
  estimated_saving?: number;
  tier?: number;
  personalise_answers?: {
    valuation_ready?: string;
    cost_base_documented?: string;
    loss_assets?: string;
    trustee_type?: string;
  };
}

// ── DOCUMENT SETS ──────────────────────────────────────────────────────────
const DOCS_67 = [
  {
    file: "FILE 01",
    type: "DECISION LOGIC",
    title: "Cost-Base Reset Decision Model",
    desc: "Reset vs. no-reset analysis personalised to your asset values and tax position.",
    url: "#", // Replace with Google Drive URL
  },
  {
    file: "FILE 02",
    type: "RISK GUIDE",
    title: "All-or-Nothing Risk Assessment",
    desc: "How the all-assets election applies to your specific fund — including loss-position asset implications.",
    url: "#",
  },
  {
    file: "FILE 03",
    type: "TEMPLATE",
    title: "Director Minute Template",
    desc: "Board resolution template documenting the election decision. Ready to complete and sign.",
    url: "#",
  },
  {
    file: "FILE 04",
    type: "CHECKLIST",
    title: "June 30 Valuation Checklist",
    desc: "Step-by-step guide to obtaining and documenting your independent asset valuations before June 30.",
    url: "#",
  },
  {
    file: "FILE 05",
    type: "GUIDE",
    title: "Loss-Position Asset Guide",
    desc: "What to do if your fund holds assets worth less than their cost base — and how the reset affects them.",
    url: "#",
  },
  {
    file: "FILE 06",
    type: "RECORD",
    title: "Two-Cost-Base Record System",
    desc: "How to maintain separate Division 296 cost bases alongside your normal SMSF accounting records.",
    url: "#",
  },
];

const DOCS_147_ADDITIONAL = [
  {
    file: "FILE 07",
    type: "ATO FORM",
    title: "Approved Form Template",
    desc: "The ATO-approved election form, pre-structured for your fund with lodgement instructions.",
    url: "#",
  },
  {
    file: "FILE 08",
    type: "RESOLUTION",
    title: "Trustee Resolution Document",
    desc: "Formal trustee resolution confirming the election — required for multi-trustee funds.",
    url: "#",
  },
  {
    file: "FILE 09",
    type: "TEMPLATE",
    title: "Asset Valuation Record Template",
    desc: "Documentation template for recording independent market valuations as at 30 June 2026.",
    url: "#",
  },
  {
    file: "FILE 10",
    type: "GUIDE",
    title: "Accountant Briefing Document",
    desc: "A structured brief for your accountant explaining the election, the two-cost-base system, and 5-year record retention requirements.",
    url: "#",
  },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

function getValuationLabel(val?: string) {
  if (val === "yes") return "✓ Valuation in progress";
  if (val === "no") return "⚠ Valuation not yet arranged — priority action";
  return "⚠ Valuation status unknown — check with accountant";
}

function getLossAssetLabel(val?: string) {
  if (val === "yes") return "⚠ Fund holds loss-position assets — review before electing";
  if (val === "no") return "✓ No loss-position assets identified";
  return "⚠ Loss-position status unknown — verify before electing";
}

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function CostBaseResetSuccessPage() {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get("tier");
  const tier = tierParam === "147" ? 147 : 67;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Restore from localStorage first (fast)
    try {
      const stored = localStorage.getItem("cost-base-reset_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      }
    } catch {
      // ignore
    }

    // Then try to restore from Supabase via session ID
    const sessionId = localStorage.getItem("cost-base-reset_session_id");
    if (sessionId) {
      fetch(`/api/decision-sessions?id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.inputs) {
            setSession({
              ...data.inputs,
              personalise_answers: data.inputs.personalise_answers,
              estimated_saving: data.output?.estimated_saving,
              tier: data.inputs.tier_intended,
            });
          }
        })
        .catch(() => {/* use localStorage fallback */});
    }

    setLoaded(true);
  }, []);

  const docs = tier === 147 ? [...DOCS_67, ...DOCS_147_ADDITIONAL] : DOCS_67;

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-neutral-400">Loading your plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAV */}
      <nav className="border-b border-neutral-200 bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-serif text-lg font-bold text-neutral-950">
            SuperTaxCheck
          </Link>
          <span className="font-mono text-xs text-neutral-400">
            Div 296 Act s.42 · Enacted 10 March 2026
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">

        {/* Header */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
              {tier === 147 ? "Full Lodgement Kit" : "Decision Logic Pack"} · {tier === 147 ? "10" : "6"} files
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-neutral-950 sm:text-4xl">
            Your Cost-Base Reset Plan Is Ready
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-700">
            {tier === 147
              ? "You are no longer just calculating. You are now preparing an election that needs to be structured correctly, documented thoroughly, and lodged on time. Every file below exists to make that happen."
              : "Before you commit to the all-or-nothing election, this plan shows exactly what you need to assess, what risks to address, and how the decision affects your specific fund."}
          </p>
          <p className="mt-3 text-sm font-semibold text-neutral-700">
            Do not move to lodgement until the steps below are complete. This is your working plan — follow it in order.
          </p>
        </div>

        {/* Save PDF prompt */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Save before you leave</p>
          <p className="mt-1 text-sm font-semibold text-neutral-800">
            Your plan is ready. Save this page as PDF now.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Browser print → Save as PDF. All file links are preserved below.
          </p>
        </div>

        {/* Personalised summary */}
        {session && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Your situation summary
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {session.cost_base && (
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-xs text-neutral-400">Original cost base</p>
                  <p className="font-serif text-lg font-bold text-neutral-950">{fmt(session.cost_base)}</p>
                </div>
              )}
              {session.market_value && (
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-xs text-neutral-400">Current market value (2026)</p>
                  <p className="font-serif text-lg font-bold text-neutral-950">{fmt(session.market_value)}</p>
                </div>
              )}
              {session.total_balance && (
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-xs text-neutral-400">Total super balance</p>
                  <p className="font-serif text-lg font-bold text-neutral-950">{fmt(session.total_balance)}</p>
                </div>
              )}
              {session.estimated_saving && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-600">Estimated Div 296 saving</p>
                  <p className="font-serif text-lg font-bold text-red-700">{fmt(session.estimated_saving)}</p>
                </div>
              )}
            </div>

            {/* Personalise answers */}
            {session.personalise_answers && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Your risk flags</p>
                <p className="text-sm text-neutral-700">
                  {getValuationLabel(session.personalise_answers.valuation_ready)}
                </p>
                <p className="text-sm text-neutral-700">
                  {getLossAssetLabel(session.personalise_answers.loss_assets)}
                </p>
                {session.personalise_answers.trustee_type === "joint" && (
                  <p className="text-sm text-neutral-700">
                    ⚠ Joint trustees — all trustees must sign the resolution
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Document list */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
            Your {tier === 147 ? "full lodgement kit" : "decision logic pack"} — {docs.length} files
          </p>
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc.file} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                        {doc.file}
                      </span>
                      <span className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] uppercase text-neutral-500">
                        {doc.type}
                      </span>
                    </div>
                    <p className="font-semibold text-neutral-950">{doc.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{doc.desc}</p>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Access →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
            Your next steps — in order
          </p>
          <ol className="space-y-3">
            {[
              "Arrange an independent valuation of all SMSF assets to be completed by 30 June 2026",
              "Review File 01 to confirm the reset decision is right for your specific fund",
              "Check File 05 for any loss-position assets that need separate consideration",
              "Complete the Director Minute (File 03) to document the board decision",
              tier === 147 ? "Lodge the Approved Form (File 07) with your 2026-27 SMSF annual tax return" : "Engage your accountant with the briefing from this pack before lodging",
              "Retain all valuation records for 5 years as required by the legislation",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-mono text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Upsell if $67 */}
        {tier === 67 && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-2">
              Ready to lodge? Upgrade to the full kit
            </p>
            <h3 className="font-serif text-xl font-bold text-neutral-950">
              The Decision Logic Pack shows you what to do. The Full Lodgement Kit gives you everything to do it.
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Includes the ATO Approved Form Template, Trustee Resolution, Asset Valuation Record, and Accountant Briefing — ready to complete and lodge.
            </p>
            <Link
              href="/check/cost-base-reset"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Upgrade to Full Lodgement Kit — $147 →
            </Link>
          </div>
        )}

        {/* Law bar */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-1">
            Legislative source
          </p>
          <p className="text-xs leading-relaxed text-blue-900">
            This plan is based on Division 296 Act s.42 as enacted 10 March 2026, cross-referenced with ATO guidance. Last verified: April 2026. This does not constitute financial, legal, or tax advice. The cost-base reset election is irrevocable. Always engage a qualified SMSF specialist before lodging.
          </p>
        </div>
      </main>
    </div>
  );
}
