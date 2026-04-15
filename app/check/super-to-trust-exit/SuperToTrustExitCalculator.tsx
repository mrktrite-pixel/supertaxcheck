"use client";

import { useState, useRef, useEffect } from "react";

// ── HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// ── CALCULATIONS ───────────────────────────────────────────────────────────

// Division 296 annual tax on a given TSB with a given earnings rate
function calcDiv296Tax(tsb: number, earningsRate: number): number {
  const LSBT = 3_000_000;
  const VLSBT = 10_000_000;
  if (tsb <= LSBT) return 0;

  const earnings = tsb * (earningsRate / 100);

  // Tier 1: $3M-$10M portion — 15% Div 296 on proportionate earnings
  const tier1Proportion = Math.min(tsb - LSBT, VLSBT - LSBT) / tsb;
  const tier1Tax = earnings * tier1Proportion * 0.15;

  // Tier 2: above $10M — additional 10% Div 296 on proportionate earnings
  const tier2Proportion = tsb > VLSBT ? (tsb - VLSBT) / tsb : 0;
  const tier2Tax = earnings * tier2Proportion * 0.10;

  return tier1Tax + tier2Tax;
}

// Estimated exit costs to move assets from SMSF to family trust
function calcExitCosts(
  tsb: number,
  assetType: AssetType,
  unrealisedGainsPct: number
): { cgt: number; stampDuty: number; total: number; note: string } {
  const gains = tsb * (unrealisedGainsPct / 100);

  // CGT: 50% CGT discount applies, taxed at fund rate 15%
  // (fund pays tax on the gain on exit)
  const cgt = gains * 0.5 * 0.15;

  let stampDuty = 0;
  let note = "";

  if (assetType === "property_direct") {
    // Average stamp duty ~4% on property transfers
    stampDuty = tsb * 0.04;
    note = "Stamp duty estimated at 4% — varies by state (NSW 4.5%, VIC 5.5%, QLD 3.5%)";
  } else if (assetType === "property_unit_trust") {
    // Unit trust — transfer of units, stamp duty varies
    stampDuty = tsb * 0.03;
    note = "Unit trust transfer — stamp duty varies. PLUS no cost base reset available on indirect assets. Pre-existing gains fully exposed to Div 296.";
  } else if (assetType === "shares") {
    stampDuty = 0;
    note = "No stamp duty on shares/cash. CGT applies on exit. Loss of 15% concessional rate permanently.";
  } else {
    stampDuty = tsb * 0.02;
    note = "Mixed asset portfolio — stamp duty estimated on property component only.";
  }

  return { cgt, stampDuty, total: cgt + stampDuty, note };
}

// 10-year wealth comparison: super vs trust
function calcTenYearComparison(
  tsb: number,
  earningsRate: number,
  numChildren: number,
  exitCosts: number
) {
  const YEARS = 10;

  // SUPER SCENARIO
  let superBalance = tsb;
  let totalDiv296 = 0;
  for (let y = 0; y < YEARS; y++) {
    const div296 = calcDiv296Tax(superBalance, earningsRate);
    totalDiv296 += div296;
    const netEarnings = superBalance * (earningsRate / 100) - div296;
    superBalance += netEarnings;
  }
  // Death benefit tax at end for adult children
  const superDeathTax = numChildren > 0 ? superBalance * 0.8 * 0.17 : 0;
  const superNetFamily = superBalance - superDeathTax;

  // TRUST SCENARIO
  // Start with TSB minus exit costs
  let trustBalance = tsb - exitCosts;
  let totalTrustTax = 0;
  // Trust distributes to beneficiaries — assume 30% effective rate
  // (mix of marginal rates via bucket company)
  for (let y = 0; y < YEARS; y++) {
    const earnings = trustBalance * (earningsRate / 100);
    const tax = earnings * 0.30; // effective trust tax rate
    totalTrustTax += tax;
    trustBalance += earnings - tax;
  }
  // No death benefit tax — assets pass through estate
  const trustNetFamily = trustBalance;

  const superWinsByAmount = superNetFamily - trustNetFamily;

  return {
    superBalance,
    superDeathTax,
    superNetFamily,
    totalDiv296,
    trustBalance,
    totalTrustTax,
    trustNetFamily,
    superWinsByAmount,
    superWins: superNetFamily >= trustNetFamily,
  };
}

// ── TYPES ──────────────────────────────────────────────────────────────────
type AssetType = "shares" | "property_direct" | "property_unit_trust" | "mixed";
type TimeHorizon = 5 | 10 | 15 | 20;
type AccountantDiscussed = "" | "yes" | "no" | "no_accountant";
type ExitConsidered = "" | "yes" | "no" | "not_sure";
type IndirectAssets = "" | "yes" | "no" | "not_sure";
type EstatePlanning = "" | "yes" | "partial" | "no";
type WhereAreYou = "" | "understanding" | "ready";

interface Answers {
  accountant_discussed: AccountantDiscussed;
  exit_considered: ExitConsidered;
  indirect_assets: IndirectAssets;
  estate_planning: EstatePlanning;
  where_are_you: WhereAreYou;
}

const INITIAL_ANSWERS: Answers = {
  accountant_discussed: "",
  exit_considered: "",
  indirect_assets: "",
  estate_planning: "",
  where_are_you: "",
};

const PRODUCTS = {
  67: {
    name: "Super-to-Trust Exit Decision Pack",
    tagline: "Should I even model an exit? What are the real costs?",
    files: [
      "Your 10-year comparative model — super vs trust with your specific numbers",
      "Exit cost calculator — CGT, stamp duty, and GST for your asset type",
      "Indirect asset trap guide — why unit trust assets get no cost base reset",
      "NALI trap explainer — why distributing from a family trust TO your SMSF costs 45% tax",
      "SMSF Alliance verdict guide — when super still wins (most people should stay)",
      "Accountant briefing document — what your adviser needs to model your situation",
    ],
    outcome: "One outcome: know whether an exit is worth modelling before spending on advice.",
  },
  147: {
    name: "Super-to-Trust Exit Planning Pack",
    tagline: "Give me the full 10-year model and the exit documents.",
    files: [
      "Everything in the Decision Pack (files 1–6)",
      "Year-by-year 10-year comparison model — super vs trust vs hybrid structure",
      "Exit execution checklist — if the model shows exit makes sense, the steps and sequencing",
      "Bucket company integration guide — how trust + company compares to super above $10M",
      "Hybrid strategy document — keep some in super, move excess — the split model",
    ],
    outcome: "One outcome: a documented strategy to present to your SMSF specialist.",
  },
};

// ── SLIDER ─────────────────────────────────────────────────────────────────
function Slider({
  label, sublabel, min, max, step, value, onChange, format,
}: {
  label: string; sublabel?: string; min: number; max: number;
  step: number; value: number; onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-800">{label}</p>
          {sublabel && <p className="mt-0.5 text-xs text-neutral-400">{sublabel}</p>}
        </div>
        <p className="shrink-0 font-serif text-xl font-bold text-neutral-950">{format(value)}</p>
      </div>
      <div className="relative h-2 rounded-full bg-neutral-200">
        <div className="absolute left-0 top-0 h-2 rounded-full bg-neutral-950 transition-all" style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        <div className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-neutral-950 bg-white shadow transition-all"
          style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function SuperToTrustExitCalculator() {
  const [tsb, setTsb] = useState(12_000_000);
  const [earningsRate, setEarningsRate] = useState(7);
  const [unrealisedGainsPct, setUnrealisedGainsPct] = useState(40);
  const [numChildren, setNumChildren] = useState(2);
  const [assetType, setAssetType] = useState<AssetType>("shares");

  const [hasResult, setHasResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [overrideTier, setOverrideTier] = useState<67 | 147 | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const questionnaireRef = useRef<HTMLDivElement>(null);

  const exitCosts = calcExitCosts(tsb, assetType, unrealisedGainsPct);
  const annualDiv296 = calcDiv296Tax(tsb, earningsRate);
  const comparison = calcTenYearComparison(tsb, earningsRate, numChildren, exitCosts.total);

  // Tier logic: above $10M and exit case is close → $147, otherwise $67, email if under $10M
  const calcTier = tsb < 10_000_000 ? "email" : comparison.superWinsByAmount < 500_000 ? 147 : 67;
  const effectiveTier = (overrideTier ?? calcTier) as "email" | 67 | 147;
  const product = effectiveTier !== "email" ? PRODUCTS[effectiveTier] : null;

  const answersComplete =
    answers.accountant_discussed !== "" &&
    answers.exit_considered !== "" &&
    answers.indirect_assets !== "" &&
    answers.estate_planning !== "" &&
    answers.where_are_you !== "";

  useEffect(() => {
    if (hasResult && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [hasResult]);

  useEffect(() => {
    if (showQuestionnaire && questionnaireRef.current) {
      setTimeout(() => questionnaireRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [showQuestionnaire]);

  function handleWhereAreYou(v: WhereAreYou) {
    setAnswers(a => ({ ...a, where_are_you: v }));
    if (v === "understanding") setOverrideTier(67);
    if (v === "ready") setOverrideTier(147);
  }

  async function handleCalculate() {
    setHasResult(true);
    setShowModal(false);
    setShowQuestionnaire(false);
    setOverrideTier(null);
    setError("");

    try {
      const res = await fetch("/api/decision-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: "super-to-trust-exit",
          source_path: "/check/super-to-trust-exit",
          inputs: { tsb, earnings_rate: earningsRate, unrealised_gains_pct: unrealisedGainsPct, num_children: numChildren, asset_type: assetType },
          output: {
            annual_div296: Math.round(annualDiv296),
            exit_costs: Math.round(exitCosts.total),
            super_net_family: Math.round(comparison.superNetFamily),
            trust_net_family: Math.round(comparison.trustNetFamily),
            super_wins_by: Math.round(comparison.superWinsByAmount),
            recommended_tier: effectiveTier,
          },
          recommended_tier: effectiveTier === "email" ? 67 : effectiveTier,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) { setSessionId(data.id); localStorage.setItem("exit_session_id", data.id); }
    } catch { /* non-blocking */ }
  }

  async function handleSaveEmail() {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, balance: tsb, source: "super_to_trust_exit" }),
    }).catch(() => {});
    setEmailSent(true);
  }

  async function handleContinueToPayment() {
    if (!answersComplete || checkoutLoading || effectiveTier === "email") return;
    const sid = sessionId || localStorage.getItem("exit_session_id");
    if (!sid) { setError("Session expired. Run the calculator again."); return; }

    setCheckoutLoading(true);
    setError("");

    try {
      await fetch("/api/decision-sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sid,
          tier_intended: effectiveTier,
          product_key: `supertax_${effectiveTier}_super_to_trust_exit`,
          questionnaire_payload: answers,
          email: email || undefined,
        }),
      });

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_session_id: sid,
          tier: effectiveTier,
          product_key: `supertax_${effectiveTier}_super_to_trust_exit`,
          success_url: `${window.location.origin}/check/super-to-trust-exit/success/${effectiveTier === 147 ? "execute" : "prepare"}`,
          cancel_url: `${window.location.origin}/check/super-to-trust-exit`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue to checkout.");
      setCheckoutLoading(false);
    }
  }

  function Radio({ name, value, current, label, onChange }: {
    name: string; value: string; current: string; label: string; onChange: (v: string) => void;
  }) {
    return (
      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${current === value ? "border-neutral-950 bg-neutral-50 font-medium" : "border-neutral-200 hover:border-neutral-300"}`}>
        <input type="radio" name={name} checked={current === value} onChange={() => onChange(value)} className="shrink-0 accent-neutral-950" />
        {label}
      </label>
    );
  }

  const isBelowThreshold = tsb < 10_000_000;
  const superWins = comparison.superWins;

  return (
    <div id="calculator" className="scroll-mt-8 space-y-6">

      {/* ── CALCULATOR ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free calculator</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
          Run the 10-year model
        </h2>
        <p className="mt-1 text-sm text-neutral-500">No payment required. Indicative modelling only — not personal financial advice.</p>

        <div className="mt-6 space-y-6">
          <Slider label="Your Total Super Balance (TSB)" sublabel="Across all your super accounts" min={3_000_000} max={20_000_000} step={250_000} value={tsb} onChange={setTsb} format={fmt} />
          <Slider label="Estimated annual earnings rate" sublabel="Long-term average return assumption" min={3} max={12} step={0.5} value={earningsRate} onChange={setEarningsRate} format={(v) => `${v}%`} />
          <Slider label="Unrealised capital gains in your fund" sublabel="Percentage of TSB that is unrealised gain — affects CGT on exit" min={0} max={80} step={5} value={unrealisedGainsPct} onChange={setUnrealisedGainsPct} format={(v) => `${v}%`} />

          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-800">Number of adult children beneficiaries</p>
            <p className="mb-3 text-xs text-neutral-400">Adult children over 18, financially independent — affects death benefit tax calculation</p>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setNumChildren(n)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${numChildren === n ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"}`}>
                  {n === 4 ? "4+" : n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-800">Primary asset type in your SMSF</p>
            <p className="mb-3 text-xs text-neutral-400">Affects stamp duty and whether cost base reset is available</p>
            <div className="space-y-2">
              {[
                { value: "shares", label: "Shares, ETFs, cash — no stamp duty on exit" },
                { value: "property_direct", label: "Property held directly by SMSF — stamp duty applies" },
                { value: "property_unit_trust", label: "Property via unit trust — no cost base reset available" },
                { value: "mixed", label: "Mixed portfolio — shares and property" },
              ].map((o) => (
                <Radio key={o.value} name="asset_type" value={o.value} current={assetType} label={o.label} onChange={(v) => setAssetType(v as AssetType)} />
              ))}
            </div>
          </div>
        </div>

        {assetType === "property_unit_trust" && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-red-700 mb-1">⚠ Critical — indirect asset trap</p>
            <p className="text-sm text-red-900">
              Assets held via a unit trust CANNOT access the Division 296 cost base reset. This is a deliberate policy decision — not an oversight. All pre-2026 capital gains on these assets are fully exposed to Division 296 tax. Source: Sladen Legal, February 2026.
            </p>
          </div>
        )}

        <button onClick={handleCalculate}
          className="mt-8 w-full rounded-xl bg-neutral-950 py-4 text-sm font-bold text-white transition hover:bg-neutral-800">
          Run My 10-Year Model →
        </button>
        <p className="mt-2 text-center text-xs text-neutral-400">Indicative modelling only. Not personal financial advice.</p>
      </div>

      {/* ── RESULT ── */}
      {hasResult && (
        <div ref={resultRef} className="scroll-mt-8 space-y-4">

          {/* Below $10M warning */}
          {isBelowThreshold && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700 mb-2">Below $10M threshold</p>
              <h3 className="font-serif text-xl font-bold text-neutral-950 mb-2">
                Super almost certainly wins at your balance.
              </h3>
              <p className="text-sm text-neutral-700">
                Between $3M and $10M, the 30% effective Div 296 rate is still lower than the effective rate in most trust structures when you account for exit costs, stamp duty, CGT on exit, and loss of the 15% concessional rate permanently. The exit cost alone typically exceeds several years of Div 296 tax savings.
              </p>
              <p className="mt-2 font-mono text-xs text-neutral-500">
                Source: SMSF Alliance, David Busoli, March 2026 — "super is still better than just about every other tax structure" for balances $3M-$10M.
              </p>
              <div className="mt-4 rounded-xl border border-amber-100 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">Your annual Division 296 tax at {fmt(tsb)}:</p>
                <p className="font-serif text-2xl font-bold text-neutral-950 mt-1">{fmt(annualDiv296)}</p>
                <p className="text-xs text-neutral-500 mt-1">This is the cost of staying in super. It is likely still lower than the exit cost.</p>
              </div>
              <div className="mt-4">
                {!emailSent ? (
                  <div className="flex gap-2">
                    <input type="email" placeholder="Save this result — your email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400" />
                    <button onClick={handleSaveEmail} className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">Save</button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-emerald-700">✓ Result saved.</p>
                )}
              </div>
            </div>
          )}

          {/* Above $10M — full result */}
          {!isBelowThreshold && (
            <div className={`rounded-2xl border p-6 sm:p-8 ${superWins ? "border-emerald-200 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Your 10-year model</p>
              <h3 className="font-serif text-2xl font-bold text-neutral-950">
                {superWins
                  ? `Super wins by ${fmt(comparison.superWinsByAmount)} over 10 years — even after Div 296.`
                  : `The exit case is close — ${fmt(Math.abs(comparison.superWinsByAmount))} difference over 10 years.`}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                {superWins
                  ? "Exit costs and loss of concessional tax rate outweigh the Div 296 saving. This does not mean never exit — it means model it carefully with a specialist."
                  : "The numbers are close enough to warrant detailed personal modelling. This is indicative only — individual circumstances change the outcome significantly."}
              </p>

              {/* Comparison grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* SUPER */}
                <div className={`rounded-xl border p-5 ${superWins ? "border-emerald-200 bg-white" : "border-neutral-200 bg-white"}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Stay in super</p>
                    {superWins && <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">WINS</span>}
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Annual Div 296 tax", value: fmt(annualDiv296), neg: true },
                      { label: "10yr total Div 296", value: fmt(comparison.totalDiv296), neg: true },
                      { label: "Balance after 10 years", value: fmt(comparison.superBalance) },
                      numChildren > 0 ? { label: `Death benefit tax (${numChildren} children)`, value: fmt(comparison.superDeathTax), neg: true } : null,
                      { label: "Net family wealth", value: fmt(comparison.superNetFamily), bold: true },
                    ].filter(Boolean).map((row, i) => row && (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                        <p className="text-xs text-neutral-600">{row.label}</p>
                        <p className={`font-mono text-sm font-bold ${row.neg ? "text-red-700" : row.bold ? "text-emerald-700" : "text-neutral-950"}`}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TRUST */}
                <div className={`rounded-xl border p-5 ${!superWins ? "border-blue-200 bg-white" : "border-neutral-200 bg-neutral-50"}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Exit to family trust</p>
                    {!superWins && <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">CLOSER</span>}
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "CGT on exit", value: fmt(exitCosts.cgt), neg: true },
                      { label: "Stamp duty on exit", value: fmt(exitCosts.stampDuty), neg: true },
                      { label: "Total exit costs", value: fmt(exitCosts.total), neg: true },
                      { label: "10yr trust tax (30% eff.)", value: fmt(comparison.totalTrustTax), neg: true },
                      { label: "Net family wealth", value: fmt(comparison.trustNetFamily), bold: true },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white px-3 py-2">
                        <p className="text-xs text-neutral-600">{row.label}</p>
                        <p className={`font-mono text-sm font-bold ${row.neg ? "text-red-700" : row.bold ? "text-blue-700" : "text-neutral-950"}`}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                  {exitCosts.note && (
                    <p className="mt-2 text-[11px] text-neutral-400">{exitCosts.note}</p>
                  )}
                </div>
              </div>

              {/* Important caveat */}
              <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Important</p>
                <p className="text-xs text-neutral-600">
                  This model assumes a 30% effective trust tax rate (bucket company structure) and 7% earnings. Your actual outcome depends on your specific asset mix, family income levels, time horizon, and estate planning intent. This is indicative only — not personal financial advice. Always engage a qualified SMSF specialist before acting.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-4 rounded-xl border border-neutral-950 bg-neutral-950 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">What happens next</p>
                <h4 className="mt-2 font-serif text-xl font-bold text-white">
                  {superWins
                    ? "Super wins — but you still need to understand why. And what happens to your unit trust assets."
                    : "The exit case is close enough to model properly with a specialist."}
                </h4>
                <button onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100">
                  {effectiveTier === 147
                    ? "Get My Planning Pack — $147 →"
                    : "Get My Decision Pack — $67 →"}
                </button>
                <p className="mt-2 text-xs text-neutral-500">One-time payment · ${effectiveTier} AUD · No subscription</p>
              </div>

              {/* Email save */}
              <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500 mb-2">Save this result — we will email a summary.</p>
                {!emailSent ? (
                  <div className="flex gap-2">
                    <input type="email" placeholder="Your email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" />
                    <button onClick={handleSaveEmail} className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">Save</button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-emerald-700">✓ Result saved.</p>
                )}
              </div>

              {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
            </div>
          )}
        </div>
      )}

      {/* ── QUESTIONNAIRE ── */}
      {showQuestionnaire && effectiveTier !== "email" && product && (
        <div ref={questionnaireRef} className="scroll-mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-1">{product.name} — ${effectiveTier}</p>
          <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-2">Tell us about your situation</h3>
          <p className="text-sm text-neutral-500 mb-6">5 quick questions — personalises the documents you receive.</p>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Has your accountant discussed the super-to-trust exit decision with you?</p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — we have modelled it together" },
                  { value: "no", label: "No — not raised yet" },
                  { value: "no_accountant", label: "I do not have a specialist SMSF adviser" },
                ].map((o) => (
                  <Radio key={o.value} name="accountant_discussed" value={o.value} current={answers.accountant_discussed} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, accountant_discussed: v as AccountantDiscussed }))} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Have you seriously considered exiting super into a trust or other structure?</p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — actively considering it" },
                  { value: "no", label: "No — just want to understand the options" },
                  { value: "not_sure", label: "Not sure — need to understand the costs first" },
                ].map((o) => (
                  <Radio key={o.value} name="exit_considered" value={o.value} current={answers.exit_considered} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, exit_considered: v as ExitConsidered }))} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Does your SMSF hold assets inside a unit trust or private company?</p>
              <p className="mb-3 text-xs text-neutral-400">These assets cannot access the Division 296 cost base reset — a critical planning issue.</p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — we hold property or shares via a unit trust or company" },
                  { value: "no", label: "No — all assets held directly by the SMSF" },
                  { value: "not_sure", label: "Not sure — need to check" },
                ].map((o) => (
                  <Radio key={o.value} name="indirect_assets" value={o.value} current={answers.indirect_assets} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, indirect_assets: v as IndirectAssets }))} />
                ))}
              </div>
              {answers.indirect_assets === "yes" && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-900 font-semibold">⚠ Urgent. Your indirect assets cannot access the cost base reset. All pre-2026 gains on those assets are fully exposed to Division 296 tax. This is the most critical planning issue in your pack.</p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Does your estate plan account for the super-to-trust decision?</p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — we have modelled the estate planning impact" },
                  { value: "partial", label: "Partially — we have a Will but not specifically this" },
                  { value: "no", label: "No — not yet considered" },
                ].map((o) => (
                  <Radio key={o.value} name="estate_planning" value={o.value} current={answers.estate_planning} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, estate_planning: v as EstatePlanning }))} />
                ))}
              </div>
            </div>

            {/* Q5 magic */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="mb-3 text-sm font-semibold text-neutral-900">Which best describes where you are right now?</p>
              <div className="space-y-2">
                {[
                  { value: "understanding", label: "I need to understand the problem and costs before deciding anything" },
                  { value: "ready", label: "I understand the risk — I need the full model and documents to act" },
                ].map((o) => (
                  <Radio key={o.value} name="where_are_you" value={o.value} current={answers.where_are_you} label={o.label}
                    onChange={(v) => handleWhereAreYou(v as WhereAreYou)} />
                ))}
              </div>
              {answers.where_are_you === "understanding" && (
                <p className="mt-3 text-xs text-blue-800">→ You will receive the <strong>Decision Pack ($67)</strong> — the 10-year model, exit costs, and the NALI and indirect asset traps explained.</p>
              )}
              {answers.where_are_you === "ready" && (
                <p className="mt-3 text-xs text-blue-800">→ You will receive the <strong>Planning Pack ($147)</strong> — full year-by-year model, exit checklist, bucket company guide, and hybrid strategy.</p>
              )}
            </div>

            {/* Product preview */}
            {answersComplete && product && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">{product.name}</p>
                <ul className="space-y-1.5">
                  {product.files.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                      <span className="mt-0.5 shrink-0 text-emerald-600">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold text-emerald-800">{product.outcome}</p>
              </div>
            )}

            <button onClick={handleContinueToPayment}
              disabled={!answersComplete || checkoutLoading}
              className="w-full rounded-xl bg-neutral-950 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40">
              {checkoutLoading ? "Redirecting to payment..." : `Continue to Payment — $${effectiveTier} →`}
            </button>
            {error && <p className="text-sm text-red-700">{error}</p>}
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && effectiveTier !== "email" && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Before you continue</p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-neutral-950">
              {superWins
                ? `Super wins by ${fmt(comparison.superWinsByAmount)} — but the NALI and indirect asset traps need attention.`
                : `The exit case is ${fmt(Math.abs(comparison.superWinsByAmount))} either way — close enough to model properly.`}
            </h3>
            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">{product.name} — what you receive</p>
              <ul className="space-y-1.5">
                {product.files.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <div>
                <p className="text-xs text-neutral-500">One-time payment · No subscription</p>
                <p className="mt-0.5 font-serif text-xl font-bold text-neutral-950">${effectiveTier} AUD</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => { setShowModal(false); setShowQuestionnaire(true); }}
                className="flex-1 rounded-xl bg-neutral-950 py-3 text-sm font-bold text-white transition hover:bg-neutral-800">
                Continue →
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
