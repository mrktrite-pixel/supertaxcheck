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

// ── VERIFIED CONSTANTS ─────────────────────────────────────────────────────
const GENERAL_TBC_2026 = 2_100_000;
const GENERAL_TBC_2025 = 2_000_000;
const INCREMENT = 100_000;
const EARNINGS_RATE = 0.07;

// ── CALCULATIONS ───────────────────────────────────────────────────────────
type PensionStatus = "never" | "partial" | "full" | "commuted";

type TBCResult = {
  personalTBC: number;
  indexationIncrease: number;
  unusedPct: number;
  unusedCapSpace: number;
  annualTaxSaving: number;
  tenYearSaving: number;
  scenario: "never" | "full_increase" | "partial_increase" | "no_increase" | "commuted_no_increase";
  recommendation: string;
  urgencyLevel: "high" | "medium" | "low";
  score: number;
  strategyNote: string;
};

function calcPersonalTBC(
  pensionStatus: PensionStatus,
  highestEverBalance: number,
  tbcWhenStarted: number,
): TBCResult {
  // Scenario 1: Never started pension
  if (pensionStatus === "never") {
    const unusedCapSpace = GENERAL_TBC_2026;
    const annualTaxSaving = unusedCapSpace * EARNINGS_RATE * 0.15;
    return {
      personalTBC: GENERAL_TBC_2026,
      indexationIncrease: INCREMENT,
      unusedPct: 100,
      unusedCapSpace,
      annualTaxSaving,
      tenYearSaving: annualTaxSaving * 10,
      scenario: "never",
      recommendation: `You get the full $2.1M cap from July 1, 2026. If you are approaching retirement, consider whether to start your pension before or after July 1. Starting after July 1 gives you $100,000 more in the tax-free pension phase.`,
      urgencyLevel: "high",
      score: 85,
      strategyNote: `If you have over $2.1M in super, starting your pension from July 1 (not before) means $2.1M goes into tax-free pension phase — $100,000 more than if you started before July 1.`,
    };
  }

  // Scenario 2: Fully used cap
  if (pensionStatus === "full") {
    return {
      personalTBC: GENERAL_TBC_2025,
      indexationIncrease: 0,
      unusedPct: 0,
      unusedCapSpace: 0,
      annualTaxSaving: 0,
      tenYearSaving: 0,
      scenario: "no_increase",
      recommendation: `Your personal cap stays at $2M — you do not get the $100,000 increase. This is because your highest ever pension balance used your full cap. The indexation only applies to the unused portion.`,
      urgencyLevel: "low",
      score: 20,
      strategyNote: `If you have a death benefit pension coming from a spouse, or plan to add super to your pension, you will need to work within the existing $2M cap. Check myGov to confirm your exact position.`,
    };
  }

  // Scenario 3: Commuted full pension — highest ever = cap
  if (pensionStatus === "commuted") {
    const unusedPctRaw = 1 - (highestEverBalance / tbcWhenStarted);
    const unusedPct = Math.floor(unusedPctRaw * 100);
    const indexationIncrease = (unusedPct / 100) * INCREMENT;
    const personalTBC = GENERAL_TBC_2025 + indexationIncrease;
    const unusedCapSpace = personalTBC - highestEverBalance;
    const annualTaxSaving = Math.max(0, unusedCapSpace) * EARNINGS_RATE * 0.15;

    if (unusedPct === 0) {
      return {
        personalTBC: GENERAL_TBC_2025,
        indexationIncrease: 0,
        unusedPct: 0,
        unusedCapSpace,
        annualTaxSaving: 0,
        tenYearSaving: 0,
        scenario: "commuted_no_increase",
        recommendation: `Even though your current pension balance is $0 (you commuted), your highest ever balance was your full cap. The indexation is based on the highest ever balance — not your current balance. Your personal cap stays at $2M.`,
        urgencyLevel: "low",
        score: 20,
        strategyNote: `This is the Simon scenario confirmed by the ATO. Commuting a pension does not reset your cap for indexation purposes. The highest ever balance is what counts.`,
      };
    }

    return {
      personalTBC,
      indexationIncrease,
      unusedPct,
      unusedCapSpace: Math.max(0, unusedCapSpace),
      annualTaxSaving,
      tenYearSaving: annualTaxSaving * 10,
      scenario: "partial_increase",
      recommendation: `You commuted a pension but had unused cap space. Your personal TBC increases by ${fmt(indexationIncrease)} to ${fmt(personalTBC)}. You can start a new pension up to ${fmt(personalTBC)} — including ${fmt(Math.max(0, unusedCapSpace))} of unused space.`,
      urgencyLevel: "medium",
      score: 60,
      strategyNote: `Check myGov to confirm your exact personal TBC. The ATO calculates this based on reported events in your Transfer Balance Account.`,
    };
  }

  // Scenario 4: Partial use — pension in progress
  const unusedPctRaw = 1 - (highestEverBalance / tbcWhenStarted);
  const unusedPct = Math.floor(unusedPctRaw * 100);
  const indexationIncrease = (unusedPct / 100) * INCREMENT;
  const personalTBC = GENERAL_TBC_2025 + indexationIncrease;
  const unusedCapSpace = personalTBC - highestEverBalance;
  const annualTaxSaving = Math.max(0, unusedCapSpace) * EARNINGS_RATE * 0.15;

  let scenario: TBCResult["scenario"] = "partial_increase";
  let score = 60;
  let urgencyLevel: TBCResult["urgencyLevel"] = "medium";

  if (unusedPct === 0) {
    scenario = "no_increase";
    score = 20;
    urgencyLevel = "low";
  } else if (unusedPct >= 50) {
    score = 75;
    urgencyLevel = "high";
  }

  return {
    personalTBC,
    indexationIncrease,
    unusedPct,
    unusedCapSpace: Math.max(0, unusedCapSpace),
    annualTaxSaving,
    tenYearSaving: annualTaxSaving * 10,
    scenario,
    recommendation: unusedPct === 0
      ? `Your personal cap stays at $2M — your highest ever pension balance used your full cap. No indexation applies.`
      : `Your personal TBC increases by ${fmt(indexationIncrease)} to ${fmt(personalTBC)} from July 1. You have ${fmt(Math.max(0, unusedCapSpace))} of unused cap space available.`,
    urgencyLevel,
    score,
    strategyNote: unusedPct > 0
      ? `You may be able to add more to your pension if you have super still in accumulation. Check with your accountant whether this makes sense given your total balance and Div 296 position.`
      : `Consider whether a recontribution strategy or other planning is relevant for your situation.`,
  };
}

// ── TYPES ──────────────────────────────────────────────────────────────────
type TBCWhenStarted = 1_600_000 | 1_700_000 | 1_900_000 | 2_000_000;
type WhereAreYou = "" | "understanding" | "ready";

interface Answers {
  pension_plan: string;
  retiring_soon: string;
  has_accumulation: string;
  div296_aware: string;
  where_are_you: WhereAreYou;
}

const INITIAL_ANSWERS: Answers = {
  pension_plan: "",
  retiring_soon: "",
  has_accumulation: "",
  div296_aware: "",
  where_are_you: "",
};

const PRODUCTS = {
  67: {
    name: "Transfer Balance Cap Optimiser — Decision Pack",
    tagline: "What is my personal cap and what can I still add to pension phase?",
    files: [
      "Your personal TBC calculation — exact cap based on your highest ever pension balance",
      "Proportional indexation explained — why $2.1M may not be your cap",
      "Unused cap space analysis — how much more you can move into pension phase",
      "Timing strategy — whether to start or adjust your pension before or after July 1",
      "Div 296 interaction guide — how the TBC increase interacts with the new earnings tax",
      "Accountant brief — what to check in myGov and what to action before July 1",
    ],
    outcome: "One outcome: know exactly what your personal cap is, how much space you have, and what to do before July 1.",
  },
  147: {
    name: "Transfer Balance Cap Optimiser — Planning Pack",
    tagline: "I have unused cap space — give me everything to use it correctly.",
    files: [
      "Everything in the Decision Pack",
      "Pension commencement strategy — optimal timing for starting or topping up a pension",
      "Death benefit pension interaction guide — how a spouse pension affects your TBC",
      "Recontribution + TBC overlay — combining the bring-forward and TBC strategies",
      "TBAR reporting guide — what your SMSF must report and when",
    ],
    outcome: "One outcome: a documented TBC strategy and pension timing plan for your accountant to implement.",
  },
};

// ── SLIDER ─────────────────────────────────────────────────────────────────
function Slider({ label, sublabel, min, max, step, value, onChange, format }: {
  label: string; sublabel?: string; min: number; max: number;
  step: number; value: number; onChange: (v: number) => void; format: (v: number) => string;
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
        <div className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-neutral-950 bg-white shadow"
          style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-400">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
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

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function TransferBalanceCapCalculator() {
  const [pensionStatus, setPensionStatus] = useState<PensionStatus>("never");
  const [highestEverBalance, setHighestEverBalance] = useState(1_200_000);
  const [tbcWhenStarted, setTbcWhenStarted] = useState<TBCWhenStarted>(2_000_000);

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

  const result = calcPersonalTBC(pensionStatus, highestEverBalance, tbcWhenStarted);
  const calcTier: 67 | 147 = result.score >= 65 ? 147 : 67;
  const effectiveTier = overrideTier ?? calcTier;
  const product = PRODUCTS[effectiveTier];

  const answersComplete = Object.values(answers).every(v => v !== "");

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
    setError("");

    try {
      const res = await fetch("/api/decision-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: "transfer-balance-cap",
          source_path: "/check/transfer-balance-cap",
          inputs: { pension_status: pensionStatus, highest_ever_balance: highestEverBalance, tbc_when_started: tbcWhenStarted },
          output: {
            personal_tbc: result.personalTBC,
            indexation_increase: result.indexationIncrease,
            unused_cap_space: result.unusedCapSpace,
            score: result.score,
            scenario: result.scenario,
            recommended_tier: effectiveTier,
          },
          recommended_tier: effectiveTier,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) { setSessionId(data.id); localStorage.setItem("tbc_session_id", data.id); }
    } catch { /* non-blocking */ }
  }

  async function handleSaveEmail() {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, balance: highestEverBalance, source: "transfer_balance_cap" }),
    }).catch(() => {});
    setEmailSent(true);
  }

  async function handleContinueToPayment() {
    if (!answersComplete || checkoutLoading) return;
    const sid = sessionId || localStorage.getItem("tbc_session_id");
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
          product_key: `supertax_${effectiveTier}_transfer_balance_cap`,
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
          product_key: `supertax_${effectiveTier}_transfer_balance_cap`,
          success_url: `${window.location.origin}/check/transfer-balance-cap/success/${effectiveTier === 147 ? "execute" : "prepare"}`,
          cancel_url: `${window.location.origin}/check/transfer-balance-cap`,
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

  return (
    <div id="calculator" className="scroll-mt-8 space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free personal cap check</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
          Find out what your personal cap actually is
        </h2>
        <p className="mt-1 text-sm text-neutral-500">Not personal financial advice. Indicative only — check myGov to confirm.</p>

        <div className="mt-6 space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-800">Have you started a retirement phase pension?</p>
            <p className="mb-3 text-xs text-neutral-400">An account-based pension (ABP) or other retirement phase income stream from your super fund.</p>
            <div className="space-y-2">
              {[
                { value: "never", label: "No — I have not started a pension yet" },
                { value: "partial", label: "Yes — I have a pension running (did not use my full cap)" },
                { value: "full", label: "Yes — I used my full cap when I started" },
                { value: "commuted", label: "Yes — but I commuted (stopped) my pension" },
              ].map((o) => (
                <Radio key={o.value} name="pension_status" value={o.value} current={pensionStatus}
                  label={o.label} onChange={(v) => setPensionStatus(v as PensionStatus)} />
              ))}
            </div>
          </div>

          {(pensionStatus === "partial" || pensionStatus === "commuted") && (
            <>
              <Slider
                label="Your highest ever pension balance"
                sublabel="The maximum amount ever in your pension account at any one time — not the current balance"
                min={200_000} max={2_000_000} step={50_000}
                value={highestEverBalance}
                onChange={setHighestEverBalance}
                format={fmt}
              />

              <div>
                <p className="mb-3 text-sm font-semibold text-neutral-800">What was the general TBC when you first started your pension?</p>
                <p className="mb-3 text-xs text-neutral-400">This determines your original personal cap.</p>
                <div className="space-y-2">
                  {[
                    { value: "1600000", label: "$1.6M — started pension before July 2021" },
                    { value: "1700000", label: "$1.7M — started between July 2021 and June 2023" },
                    { value: "1900000", label: "$1.9M — started between July 2023 and June 2025" },
                    { value: "2000000", label: "$2.0M — started between July 2025 and June 2026" },
                  ].map((o) => (
                    <Radio key={o.value} name="tbc_when" value={o.value} current={String(tbcWhenStarted)}
                      label={o.label} onChange={(v) => setTbcWhenStarted(Number(v) as TBCWhenStarted)} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <button onClick={handleCalculate}
          className="mt-8 w-full rounded-xl bg-neutral-950 py-4 text-sm font-bold text-white transition hover:bg-neutral-800">
          Calculate My Personal Cap →
        </button>
        <p className="mt-2 text-center text-xs text-neutral-400">Indicative only. Check myGov or ask your accountant to confirm.</p>
      </div>

      {/* ── RESULT ── */}
      {hasResult && (
        <div ref={resultRef} className="scroll-mt-8 space-y-4">
          <div className={`rounded-2xl border p-6 sm:p-8 ${
            result.urgencyLevel === "high" ? "border-emerald-200 bg-emerald-50" :
            result.urgencyLevel === "medium" ? "border-blue-200 bg-blue-50" :
            "border-neutral-200 bg-neutral-50"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Your personal TBC from July 1, 2026</span>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                result.score >= 65 ? "bg-emerald-100 text-emerald-700" :
                result.score >= 40 ? "bg-blue-100 text-blue-700" :
                "bg-neutral-100 text-neutral-600"
              }`}>{result.score}/100</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-3">
              {result.scenario === "never"
                ? "You get the full $2.1M cap from July 1."
                : result.scenario === "no_increase" || result.scenario === "commuted_no_increase"
                ? "Your personal cap stays at $2M — no indexation applies."
                : `Your personal cap increases to ${fmt(result.personalTBC)} from July 1.`}
            </h3>

            <p className="text-sm text-neutral-700 mb-5">{result.recommendation}</p>

            <div className="grid gap-3 sm:grid-cols-3 mb-4">
              {[
                { label: "Your personal TBC from July 1", value: fmt(result.personalTBC), green: result.indexationIncrease > 0 },
                { label: "Indexation increase you receive", value: result.indexationIncrease > 0 ? fmt(result.indexationIncrease) : "$0", green: result.indexationIncrease > 0 },
                { label: "Unused cap space available", value: result.unusedCapSpace > 0 ? fmt(result.unusedCapSpace) : "None", green: result.unusedCapSpace > 0 },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.green ? "border-emerald-200 bg-emerald-50" : "border-neutral-200 bg-white"}`}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.label}</p>
                  <p className={`font-serif text-xl font-bold ${item.green ? "text-emerald-700" : "text-neutral-950"}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {result.unusedCapSpace > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3 mb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Tax saving from using unused cap space</p>
                <p className="text-sm text-neutral-700">
                  Moving {fmt(result.unusedCapSpace)} from accumulation (15% tax on earnings) to pension phase (0% tax) saves approximately{" "}
                  <strong>{fmt(result.annualTaxSaving)} per year</strong> in tax at 7% earnings.
                  Over 10 years: <strong>{fmt(result.tenYearSaving)}</strong>.
                </p>
              </div>
            )}

            {result.strategyNote && (
              <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 mb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Strategy note</p>
                <p className="text-sm text-neutral-700">{result.strategyNote}</p>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-neutral-950 bg-neutral-950 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">What happens next</p>
              <h4 className="mt-2 font-serif text-xl font-bold text-white">
                {result.score >= 65
                  ? "You have unused cap space. Get the timing and implementation right."
                  : "Understand your exact position before July 1."}
              </h4>
              <button onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100">
                Get My {effectiveTier === 147 ? "Planning" : "Decision"} Pack — ${effectiveTier} →
              </button>
              <p className="mt-2 text-xs text-neutral-500">One-time · ${effectiveTier} AUD · No subscription</p>
            </div>

            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500 mb-2">Leave your email and we will send a copy to show your accountant.</p>
              {!emailSent ? (
                <div className="flex gap-2">
                  <input type="email" placeholder="Your email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400" />
                  <button onClick={handleSaveEmail} className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">Save</button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-emerald-700">✓ Saved. A copy is on its way.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── QUESTIONNAIRE ── */}
      {showQuestionnaire && product && (
        <div ref={questionnaireRef} className="scroll-mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-1">{product.name} — ${effectiveTier}</p>
          <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-2">Tell us about your situation</h3>
          <p className="text-sm text-neutral-500 mb-6">4 quick questions — personalises the documents you receive.</p>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">What are your pension plans?</p>
              <div className="space-y-2">
                {[
                  { value: "starting_soon", label: "I am about to start a pension for the first time" },
                  { value: "topping_up", label: "I have a pension and want to add more to pension phase" },
                  { value: "reviewing", label: "I want to understand my position before deciding" },
                  { value: "death_benefit", label: "I am receiving or expecting a death benefit pension from a spouse" },
                ].map((o) => (
                  <Radio key={o.value} name="pension_plan" value={o.value} current={answers.pension_plan}
                    label={o.label} onChange={(v) => setAnswers(a => ({ ...a, pension_plan: v }))} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Are you retiring on or around July 1, 2026?</p>
              <div className="space-y-2">
                {[
                  { value: "before_july", label: "No — I am retiring or have retired before July 1" },
                  { value: "after_july", label: "Yes — I am retiring on or after July 1, 2026" },
                  { value: "already_retired", label: "I am already fully retired" },
                  { value: "not_yet", label: "Not for a while yet" },
                ].map((o) => (
                  <Radio key={o.value} name="retiring_soon" value={o.value} current={answers.retiring_soon}
                    label={o.label} onChange={(v) => setAnswers(a => ({ ...a, retiring_soon: v }))} />
                ))}
              </div>
              {answers.retiring_soon === "after_july" && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs text-emerald-900 font-semibold">✓ Good timing. Starting your pension from July 1 gives you access to the $2.1M cap — $100,000 more in the tax-free zone than if you started before July 1.</p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Do you have super still sitting in accumulation phase?</p>
              <p className="mb-3 text-xs text-neutral-400">Accumulation phase earns at 15% tax rate. Pension phase earns at 0%. Any unused cap space lets you move more into the 0% zone.</p>
              <div className="space-y-2">
                {[
                  { value: "yes_significant", label: "Yes — significant amount in accumulation" },
                  { value: "yes_small", label: "Yes — a small amount remains in accumulation" },
                  { value: "no", label: "No — everything is already in pension phase" },
                  { value: "unsure", label: "Not sure — need to check" },
                ].map((o) => (
                  <Radio key={o.value} name="has_accumulation" value={o.value} current={answers.has_accumulation}
                    label={o.label} onChange={(v) => setAnswers(a => ({ ...a, has_accumulation: v }))} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Have you run the Div 296 Wealth Eraser (Gate 01) for your fund?</p>
              <p className="mb-3 text-xs text-neutral-400">Moving more into pension phase interacts with the new Div 296 tax if your balance is over $3M.</p>
              <div className="space-y-2">
                {[
                  { value: "yes_done", label: "Yes — I have already run the June 30 check" },
                  { value: "no_under3m", label: "No — my balance is under $3M so it does not apply" },
                  { value: "no_need_to", label: "No — I need to check that too" },
                  { value: "not_sure", label: "Not sure what Div 296 is" },
                ].map((o) => (
                  <Radio key={o.value} name="div296_aware" value={o.value} current={answers.div296_aware}
                    label={o.label} onChange={(v) => setAnswers(a => ({ ...a, div296_aware: v }))} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="mb-3 text-sm font-semibold text-neutral-900">Which best describes where you are right now?</p>
              <div className="space-y-2">
                {[
                  { value: "understanding", label: "I want to understand my personal cap and options before acting" },
                  { value: "ready", label: "I understand the cap — I need the timing plan and implementation documents" },
                ].map((o) => (
                  <Radio key={o.value} name="where_are_you" value={o.value} current={answers.where_are_you}
                    label={o.label} onChange={(v) => handleWhereAreYou(v as WhereAreYou)} />
                ))}
              </div>
              {answers.where_are_you === "understanding" && (
                <p className="mt-3 text-xs text-blue-800">→ You will receive the <strong>Decision Pack ($67)</strong> — personal cap calculation, unused space analysis, timing strategy, and accountant brief.</p>
              )}
              {answers.where_are_you === "ready" && (
                <p className="mt-3 text-xs text-blue-800">→ You will receive the <strong>Planning Pack ($147)</strong> — full implementation documents, pension timing plan, and TBAR reporting guide.</p>
              )}
            </div>

            {answersComplete && (
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
      {showModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Before you continue</p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-neutral-950">{product.name}</h3>
            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
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
