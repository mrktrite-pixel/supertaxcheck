"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

interface StoredResult {
  balance?: number;
  costBase?: number;
  marketValue?: number;
  saving?: number;
  personalise_answers?: {
    valuation_ready?: string;
    loss_assets?: string;
    trustee_type?: string;
    cost_base_documented?: string;
  };
}

const DOCS_PREPARE = [
  { file: "FILE 01", type: "DECISION MODEL", title: "Reset vs. No-Reset Decision Logic", desc: "Structured analysis confirming the election is the right move for your fund. Includes the net benefit calculation with your specific numbers." },
  { file: "FILE 02", type: "RISK ASSESSMENT", title: "All-or-Nothing Risk Assessment", desc: "How the all-assets election applies to your specific fund. Loss-position asset risk analysis. Net benefit confirmation." },
  { file: "FILE 03", type: "TEMPLATE", title: "Director Minute Template", desc: "Board resolution documenting the election decision. Pre-structured for sole and joint trustee arrangements." },
  { file: "FILE 04", type: "CHECKLIST", title: "June 30 Valuation Checklist", desc: "Step-by-step guide to independent valuations before June 30. Lead times for property, shares, and unlisted assets." },
  { file: "FILE 05", type: "GUIDE", title: "Loss-Position Asset Guide", desc: "How the reset affects assets in a loss position. Whether to sell before June 30 or manage within the election." },
  { file: "FILE 06", type: "RECORD SYSTEM", title: "Two-Cost-Base Record System", desc: "Maintaining separate Division 296 cost bases alongside normal SMSF accounting records for 5 years." },
];

const DOCS_EXECUTE = [
  { file: "FILE 07", type: "ATO FORM", title: "Approved Form Template", desc: "The ATO-approved cost-base reset election form, pre-structured for your fund with lodgement instructions and completion guide." },
  { file: "FILE 08", type: "RESOLUTION", title: "Trustee Resolution Document", desc: "Formal trustee resolution confirming the all-assets election. Required for multi-trustee funds. All trustees must sign." },
  { file: "FILE 09", type: "RECORD", title: "Asset Valuation Record Template", desc: "Documentation template recording independent market valuations as at 30 June 2026 — required for ATO compliance and 5-year retention." },
  { file: "FILE 10", type: "BRIEFING", title: "Accountant Briefing Document", desc: "Structured brief for your accountant explaining the election, the two-cost-base system, lodgement timing, and 5-year record retention requirements." },
];

export default function ExecuteSuccessPage() {
  const [result, setResult] = useState<StoredResult | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cbr_result");
      if (stored) setResult(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const valuationFlag = result?.personalise_answers?.valuation_ready;
  const lossFlag = result?.personalise_answers?.loss_assets;
  const trusteeFlag = result?.personalise_answers?.trustee_type;

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="border-b border-neutral-200 bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-serif text-lg font-bold text-neutral-950">SuperTaxCheck</Link>
          <span className="font-mono text-xs text-neutral-400">Div 296 Act s.42 · Enacted 10 March 2026</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">

        {/* Header */}
        <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 sm:p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              Full Lodgement Kit · $147 · 10 files
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Your Full Lodgement Kit Is Ready
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-300">
            You are no longer just calculating. You are preparing an irrevocable election that must be structured correctly, documented thoroughly, and lodged on time. Every file below exists to make that happen. Follow the steps in order.
          </p>
          {result?.saving && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3">
              <p className="text-sm text-neutral-400">Estimated tax you are protecting:</p>
              <p className="font-serif text-xl font-bold text-emerald-400">{fmt(result.saving)}</p>
            </div>
          )}
        </div>

        {/* Save prompt */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Save before you leave</p>
          <p className="mt-1 text-sm font-semibold text-neutral-800">Browser print → Save as PDF to keep all file links.</p>
        </div>

        {/* Your numbers */}
        {result && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">Your situation</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {result.balance && (
                <div className="rounded-lg bg-neutral-50 px-4 py-3">
                  <p className="text-xs text-neutral-400">Total super balance</p>
                  <p className="mt-1 font-serif text-lg font-bold text-neutral-950">{fmt(result.balance)}</p>
                </div>
              )}
              {result.costBase && (
                <div className="rounded-lg bg-neutral-50 px-4 py-3">
                  <p className="text-xs text-neutral-400">Original cost base</p>
                  <p className="mt-1 font-serif text-lg font-bold text-neutral-950">{fmt(result.costBase)}</p>
                </div>
              )}
              {result.saving && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="text-xs text-emerald-600">Tax you are protecting</p>
                  <p className="mt-1 font-serif text-lg font-bold text-emerald-700">{fmt(result.saving)}</p>
                </div>
              )}
            </div>

            {/* Risk flags */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Your action flags</p>
              {valuationFlag === "no" && (
                <p className="text-sm text-red-700">🚨 Valuation not yet arranged — this is your most urgent action. See File 04.</p>
              )}
              {valuationFlag === "yes" && (
                <p className="text-sm text-emerald-700">✓ Valuation in progress — ensure it is completed by June 30</p>
              )}
              {lossFlag === "yes" && (
                <p className="text-sm text-amber-700">⚠ Fund holds loss-position assets — review File 05 before lodging</p>
              )}
              {trusteeFlag === "joint" && (
                <p className="text-sm text-amber-700">⚠ Joint trustees — all trustees must sign File 08 before lodgement</p>
              )}
            </div>
          </div>
        )}

        {/* Prepare files */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Part 1 of 2
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Decide and prepare — files 01–06
            </p>
          </div>
          <div className="space-y-3">
            {DOCS_PREPARE.map((doc) => (
              <div key={doc.file} className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{doc.file}</span>
                      <span className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] uppercase text-neutral-500">{doc.type}</span>
                    </div>
                    <p className="font-semibold text-neutral-950">{doc.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{doc.desc}</p>
                  </div>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50">
                    Access →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execute files */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-blue-600">
              Part 2 of 2
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Execute and lodge — files 07–10
            </p>
          </div>
          <div className="space-y-3">
            {DOCS_EXECUTE.map((doc) => (
              <div key={doc.file} className="rounded-xl border border-blue-100 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">{doc.file}</span>
                      <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-[10px] uppercase text-blue-600">{doc.type}</span>
                    </div>
                    <p className="font-semibold text-neutral-950">{doc.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{doc.desc}</p>
                  </div>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
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
            Your lodgement steps — in order
          </p>
          <ol className="space-y-3">
            {[
              "Read File 01 to confirm the election is right for your specific fund",
              "Check File 05 if your fund holds any asset in a loss position",
              "Arrange independent valuations of ALL SMSF assets by 30 June 2026 (File 04)",
              "Complete the Director Minute (File 03) and Trustee Resolution (File 08)",
              "Set up the two-cost-base record system (File 06) before lodgement",
              "Give the Accountant Briefing (File 10) to your accountant",
              "Lodge the Approved Form (File 07) with your 2026-27 SMSF annual tax return",
              "Retain all valuation records (File 09) for 5 years as required by legislation",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white ${i >= 5 ? "bg-blue-600" : "bg-neutral-950"}`}>
                  {i + 1}
                </span>
                {step}
                {i >= 5 && (
                  <span className="shrink-0 rounded-md bg-blue-100 px-2 py-0.5 font-mono text-[9px] uppercase text-blue-600">Execute</span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Important disclaimer</p>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
            Based on Division 296 Act s.42, enacted 10 March 2026. Not financial, legal, or tax advice. The cost-base reset election is irrevocable. Always engage a qualified SMSF specialist before lodging.
          </p>
        </div>
      </main>
    </div>
  );
}
