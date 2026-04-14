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
  };
}

const DOCS = [
  { file: "FILE 01", type: "DECISION MODEL", title: "Reset vs. No-Reset Decision Logic", desc: "A structured analysis of whether the election is right for your specific fund. Covers the all-or-nothing rule, loss-position assets, and the net benefit calculation." },
  { file: "FILE 02", type: "RISK ASSESSMENT", title: "All-or-Nothing Risk Assessment Guide", desc: "How the all-assets election applies to your fund. What happens if any asset is in a loss position. How to assess the net impact before you commit." },
  { file: "FILE 03", type: "TEMPLATE", title: "Director Minute Template", desc: "Board resolution documenting the election decision. Pre-structured for sole and joint trustee arrangements. Ready to complete and sign." },
  { file: "FILE 04", type: "CHECKLIST", title: "June 30 Valuation Checklist", desc: "Step-by-step guide to obtaining and documenting your independent asset valuations before June 30. Includes lead times for property, shares, and unlisted assets." },
  { file: "FILE 05", type: "GUIDE", title: "Loss-Position Asset Guide", desc: "What to do if your fund holds any asset worth less than its purchase price. How the reset affects it. Whether to sell before June 30 or proceed with caution." },
  { file: "FILE 06", type: "RECORD SYSTEM", title: "Two-Cost-Base Record System", desc: "How to maintain separate Division 296 cost bases alongside your normal SMSF accounting records — required for 5 years under the legislation." },
];

export default function PrepareSuccessPage() {
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
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
              Decision Logic Pack · $67 · 6 files
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-neutral-950 sm:text-4xl">
            Your Decision Logic Pack Is Ready
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-700">
            Before you commit to an irrevocable election, this pack gives you the logic, the risk assessment, and the documentation to make the right decision for your fund. Follow the steps below in order.
          </p>
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
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-600">Estimated avoidable tax</p>
                  <p className="mt-1 font-serif text-lg font-bold text-red-700">{fmt(result.saving)}</p>
                </div>
              )}
            </div>

            {/* Risk flags */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Your risk flags</p>
              {valuationFlag === "no" && (
                <p className="text-sm text-amber-700">⚠ Valuation not yet arranged — priority action before June 30</p>
              )}
              {valuationFlag === "yes" && (
                <p className="text-sm text-emerald-700">✓ Valuation in progress</p>
              )}
              {lossFlag === "yes" && (
                <p className="text-sm text-amber-700">⚠ Fund holds loss-position assets — review File 05 before electing</p>
              )}
              {lossFlag === "no" && (
                <p className="text-sm text-emerald-700">✓ No loss-position assets identified</p>
              )}
              {trusteeFlag === "joint" && (
                <p className="text-sm text-amber-700">⚠ Joint trustees — all trustees must sign the Director Minute</p>
              )}
            </div>
          </div>
        )}

        {/* Document list */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
            Your decision logic pack — 6 files
          </p>
          <div className="space-y-3">
            {DOCS.map((doc) => (
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

        {/* Next steps */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">Your next steps — in order</p>
          <ol className="space-y-3">
            {[
              "Read File 01 to determine if the reset is right for your specific fund",
              "Check File 05 if your fund holds any loss-position assets",
              "Arrange an independent valuation of all SMSF assets completed by 30 June 2026",
              "Complete the Director Minute (File 03) to document your decision",
              "Set up the two-cost-base record system (File 06) before your accountant lodges",
              "Engage your accountant once the decision is confirmed — give them File 03 and File 06",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-mono text-[10px] font-bold text-white">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Upgrade CTA */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-blue-600 mb-2">
            Ready to lodge? Upgrade to Execute
          </p>
          <h3 className="font-serif text-xl font-bold text-neutral-950">
            The Decision Logic Pack tells you what to do. The Full Lodgement Kit gives you everything to do it.
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Includes the ATO Approved Form Template, Trustee Resolution, Asset Valuation Record, Accountant Briefing, and Lodgement Timing Guide.
          </p>
          <Link
            href="/check/cost-base-reset"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Upgrade to Full Lodgement Kit — $147 →
          </Link>
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
