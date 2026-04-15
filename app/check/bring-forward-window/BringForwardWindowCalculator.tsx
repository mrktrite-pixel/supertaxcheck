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

// ── VERIFIED CONSTANTS (July 1, 2026) ─────────────────────────────────────
const CAPS = {
  NCC_2026: 130_000,          // Annual NCC cap from July 1 2026
  NCC_2025: 120_000,          // Current annual NCC cap
  TBC_2026: 2_100_000,        // Transfer Balance Cap from July 1 2026
  BRING_3YR_2026: 390_000,    // 3-year bring-forward from July 1 2026
  BRING_3YR_2025: 360_000,    // 3-year bring-forward current
  BRING_2YR_2026: 260_000,    // 2-year bring-forward from July 1 2026
  CC_2026: 32_500,            // Concessional cap from July 1 2026
  CC_2025: 30_000,            // Concessional cap current
  CARRY_TSB_LIMIT: 500_000,   // TSB limit for carry-forward eligibility
};

// TSB thresholds for bring-forward (based on TBC - n × NCC)
const BF_THRESH = {
  FULL_3YR: CAPS.TBC_2026 - 2 * CAPS.NCC_2026,   // $1,840,000
  TWO_YR:   CAPS.TBC_2026 - CAPS.NCC_2026,         // $1,970,000
  ONE_YR:   CAPS.TBC_2026,                          // $2,100,000
};

// ── CALCULATIONS ───────────────────────────────────────────────────────────
type BringForwardResult = {
  eligible: boolean;
  maxContribution: number;
  years: number;
  lockedOut: boolean;
  carryForwardEligible: boolean;
  tsbBand: "full" | "two" | "one" | "none";
  strategyNote: string;
  urgencyLevel: "critical" | "high" | "medium" | "low";
  score: number;
};

function calcBringForward(
  tsb: number,
  age: number,
  alreadyTriggered: boolean,
  carryForwardAvailable: number,
): BringForwardResult {
  // Age check — must be under 75
  if (age >= 75) {
    return {
      eligible: false,
      maxContribution: 0,
      years: 0,
      lockedOut: false,
      carryForwardEligible: false,
      tsbBand: "none",
      strategyNote: "Non-concessional contributions are not available at age 75 or over.",
      urgencyLevel: "low",
      score: 0,
    };
  }

  // Already triggered — locked out of new cap
  if (alreadyTriggered) {
    return {
      eligible: true,
      maxContribution: 0,
      years: 0,
      lockedOut: true,
      carryForwardEligible: tsb < CAPS.CARRY_TSB_LIMIT && carryForwardAvailable > 0,
      tsbBand: "none",
      strategyNote: "You triggered the bring-forward rule in 2024-25 or 2025-26. Your cap is locked at $360,000 for that period. You cannot access the new $390,000 cap until your bring-forward period expires.",
      urgencyLevel: "medium",
      score: 30,
    };
  }

  // TSB band
  let tsbBand: BringForwardResult["tsbBand"];
  let maxContribution: number;
  let years: number;

  if (tsb >= BF_THRESH.ONE_YR) {
    tsbBand = "none";
    maxContribution = 0;
    years = 0;
  } else if (tsb >= BF_THRESH.TWO_YR) {
    tsbBand = "one";
    maxContribution = CAPS.NCC_2026;
    years = 1;
  } else if (tsb >= BF_THRESH.FULL_3YR) {
    tsbBand = "two";
    maxContribution = CAPS.BRING_2YR_2026;
    years = 2;
  } else {
    tsbBand = "full";
    maxContribution = CAPS.BRING_3YR_2026;
    years = 3;
  }

  const eligible = maxContribution > 0;
  const carryForwardEligible = tsb < CAPS.CARRY_TSB_LIMIT && carryForwardAvailable > 0;

  let strategyNote = "";
  let urgencyLevel: BringForwardResult["urgencyLevel"] = "medium";
  let score = 50;

  if (tsbBand === "full" && age < 70) {
    strategyNote = `You are eligible for the full $390,000 bring-forward from July 1. If you contribute $${(CAPS.NCC_2025 / 1000).toFixed(0)}k before June 30 this year (without triggering bring-forward), you can then put in $390,000 from July 1 — a total of $510,000 across two financial years.`;
    urgencyLevel = "critical";
    score = 90;
  } else if (tsbBand === "full") {
    strategyNote = `You are eligible for the full $390,000 bring-forward from July 1. Act before you turn 75 — after that non-concessional contributions are not available.`;
    urgencyLevel = "high";
    score = 75;
  } else if (tsbBand === "two") {
    strategyNote = `Your balance means you can bring forward $260,000 (two years of contributions). To access the full $390,000 you would need your balance to be under $1,840,000 at June 30, 2026.`;
    urgencyLevel = "high";
    score = 60;
  } else if (tsbBand === "one") {
    strategyNote = `You can only contribute the annual cap of $130,000. To access the bring-forward rule you need your balance under $1,970,000 at June 30, 2026.`;
    urgencyLevel = "medium";
    score = 40;
  } else {
    strategyNote = `Your balance is at or over $2.1M — you cannot make non-concessional contributions this year. If you can reduce your balance below $2.1M by June 30, 2026, eligibility may open up.`;
    urgencyLevel = "low";
    score = 10;
  }

  if (carryForwardEligible) {
    score = Math.min(100, score + 10);
  }

  return {
    eligible,
    maxContribution,
    years,
    lockedOut: false,
    carryForwardEligible,
    tsbBand,
    strategyNote,
    urgencyLevel,
    score,
  };
}

// ── TYPES ──────────────────────────────────────────────────────────────────
type AlreadyTriggered = "yes_2425" | "yes_2526" | "no" | "unsure";
type WhereAreYou = "" | "understanding" | "ready";

interface Answers {
  timing: string;
  source_of_funds: string;
  div296_risk: string;
  carry_forward: string;
  where_are_you: WhereAreYou;
}

const INITIAL_ANSWERS: Answers = {
  timing: "",
  source_of_funds: "",
  div296_risk: "",
  carry_forward: "",
  where_are_you: "",
};

const PRODUCTS = {
  67: {
    name: "Bring-Forward $390K Decision Pack",
    tagline: "Am I eligible? What is the best timing?",
    files: [
      "Your personal eligibility assessment with the correct TSB thresholds",
      "Timing strategy — before or after July 1 and why it matters for your balance",
      "Locked-out check — whether a prior bring-forward affects the new $390K cap",
      "Carry-forward concessional checker — 2020-21 expiry June 30 hard deadline",
      "Div 296 interaction guide — does contributing push you over $3M?",
      "Accountant brief — what to action before June 30 and what to action after July 1",
    ],
    outcome: "One outcome: know exactly what you can contribute, when, and whether June 30 or July 1 is the right timing.",
  },
  147: {
    name: "Bring-Forward $390K Planning Pack",
    tagline: "I am eligible — give me the full strategy and documents.",
    files: [
      "Everything in the Decision Pack",
      "Contribution scheduling plan — splitting across June 30 and July 1 for maximum outcome",
      "SMSF contribution acceptance checklist — what the fund needs to receive by June 30",
      "Notice of Intent to Claim Deduction template (concessional contributions)",
      "Recontribution strategy overlay — if bring-forward combines with death benefit planning",
    ],
    outcome: "One outcome: a documented contribution strategy for your accountant to implement.",
  },
};

// ── SLIDER COMPONENT ───────────────────────────────────────────────────────
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
export default function BringForwardWindowCalculator() {
  const [tsb, setTsb] = useState(1_500_000);
  const [age, setAge] = useState(62);
  const [alreadyTriggered, setAlreadyTriggered] = useState<AlreadyTriggered>("no");
  const [carryForwardAvailable, setCarryForwardAvailable] = useState(50_000);

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

  const isTriggered = alreadyTriggered === "yes_2425" || alreadyTriggered === "yes_2526";
  const result = calcBringForward(tsb, age, isTriggered, carryForwardAvailable);

  const calcTier: 67 | 147 = result.score >= 70 ? 147 : 67;
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
          product_slug: "bring-forward-window",
          source_path: "/check/bring-forward-window",
          inputs: { tsb, age, already_triggered: alreadyTriggered, carry_forward_available: carryForwardAvailable },
          output: {
            eligible: result.eligible,
            max_contribution: result.maxContribution,
            locked_out: result.lockedOut,
            tsb_band: result.tsbBand,
            score: result.score,
            recommended_tier: effectiveTier,
          },
          recommended_tier: effectiveTier,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) { setSessionId(data.id); localStorage.setItem("bfw_session_id", data.id); }
    } catch { /* non-blocking */ }
  }

  async function handleSaveEmail() {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, balance: tsb, source: "bring_forward_window" }),
    }).catch(() => {});
    setEmailSent(true);
  }

  async function handleContinueToPayment() {
    if (!answersComplete || checkoutLoading) return;
    const sid = sessionId || localStorage.getItem("bfw_session_id");
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
          product_key: `supertax_${effectiveTier}_bring_forward_window`,
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
          product_key: `supertax_${effectiveTier}_bring_forward_window`,
          success_url: `${window.location.origin}/check/bring-forward-window/success/${effectiveTier === 147 ? "execute" : "prepare"}`,
          cancel_url: `${window.location.origin}/check/bring-forward-window`,
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

  const urgencyColour = result.urgencyLevel === "critical" ? "red" :
    result.urgencyLevel === "high" ? "amber" :
    result.urgencyLevel === "medium" ? "blue" : "neutral";

  return (
    <div id="calculator" className="scroll-mt-8 space-y-6">

      {/* ── CALCULATOR ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free eligibility check</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
          Find out what you can contribute — and when
        </h2>
        <p className="mt-1 text-sm text-neutral-500">Not personal financial advice. Indicative only.</p>

        <div className="mt-6 space-y-6">
          <Slider label="Your total super balance" sublabel="Across all your super accounts at 30 June 2026" min={500_000} max={2_500_000} step={50_000} value={tsb} onChange={setTsb} format={fmt} />

          <Slider label="Your age" sublabel="Must be under 75 to make non-concessional contributions" min={50} max={80} step={1} value={age} onChange={setAge} format={(v) => `${v} years old`} />

          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-800">Have you already triggered the bring-forward rule?</p>
            <p className="mb-3 text-xs text-neutral-400">If you made a large after-tax contribution in 2024-25 or 2025-26 that triggered a 3-year period, you are locked out of the new $390,000 cap.</p>
            <div className="space-y-2">
              {[
                { value: "no", label: "No — I have not triggered it" },
                { value: "yes_2526", label: "Yes — I triggered it in 2025-26 (this financial year)" },
                { value: "yes_2425", label: "Yes — I triggered it in 2024-25 (last financial year)" },
                { value: "unsure", label: "Not sure — I need to check" },
              ].map((o) => (
                <Radio key={o.value} name="triggered" value={o.value} current={alreadyTriggered}
                  label={o.label} onChange={(v) => setAlreadyTriggered(v as AlreadyTriggered)} />
              ))}
            </div>
          </div>

          {tsb < CAPS.CARRY_TSB_LIMIT && (
            <div>
              <Slider label="Carry-forward unused concessional contributions (estimate)" sublabel="Only relevant if your balance is under $500,000. 2020-21 amounts expire June 30, 2026." min={0} max={175_000} step={5_000} value={carryForwardAvailable} onChange={setCarryForwardAvailable} format={fmt} />
            </div>
          )}
        </div>

        {alreadyTriggered === "unsure" && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-900">
              <strong>Check myGov before doing anything.</strong> Log into myGov → ATO online services → Super → Bring-forward period. It will tell you whether you are currently in a bring-forward period and how much remains.
            </p>
          </div>
        )}

        <button onClick={handleCalculate}
          className="mt-8 w-full rounded-xl bg-neutral-950 py-4 text-sm font-bold text-white transition hover:bg-neutral-800">
          Check My Eligibility →
        </button>
        <p className="mt-2 text-center text-xs text-neutral-400">Indicative only. Not personal financial advice.</p>
      </div>

      {/* ── RESULT ── */}
      {hasResult && (
        <div ref={resultRef} className="scroll-mt-8 space-y-4">
          <div className={`rounded-2xl border p-6 sm:p-8 ${
            urgencyColour === "red" ? "border-red-200 bg-red-50" :
            urgencyColour === "amber" ? "border-amber-200 bg-amber-50" :
            urgencyColour === "blue" ? "border-blue-200 bg-blue-50" :
            "border-neutral-200 bg-neutral-50"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Your result</span>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                result.score >= 70 ? "bg-red-100 text-red-700" :
                result.score >= 40 ? "bg-amber-100 text-amber-700" :
                "bg-neutral-100 text-neutral-600"
              }`}>{result.score}/100</span>
            </div>

            {result.lockedOut ? (
              <>
                <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                  You are locked in at $360,000 — not the new $390,000.
                </h3>
                <p className="text-sm text-neutral-700 mb-4">
                  Because you triggered the bring-forward rule in 2024-25 or 2025-26, your period is locked at the cap that applied when you triggered — $360,000 over 3 years. The new $390,000 cap does not apply to an existing bring-forward period. You can access the new cap when your current period expires.
                </p>
              </>
            ) : age >= 75 ? (
              <>
                <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                  Non-concessional contributions are not available at age 75 or over.
                </h3>
                <p className="text-sm text-neutral-700">The bring-forward rule requires you to be under 75 at the time of contribution.</p>
              </>
            ) : result.tsbBand === "none" ? (
              <>
                <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                  Your balance is too high — no non-concessional contributions available.
                </h3>
                <p className="text-sm text-neutral-700">At {fmt(tsb)}, your balance is at or over the $2.1M cap. If you can reduce your balance below $2.1M by June 30, 2026, eligibility may open up in 2026-27.</p>
              </>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-2">
                  {result.tsbBand === "full"
                    ? `You are eligible for the full $390,000 from July 1, 2026.`
                    : result.tsbBand === "two"
                    ? `You can bring forward $260,000 — two years of contributions.`
                    : `You can contribute the annual cap of $130,000.`}
                </h3>
                <p className="text-sm text-neutral-700 mb-4">{result.strategyNote}</p>

                <div className="grid gap-3 sm:grid-cols-3 mb-4">
                  {[
                    { label: "Maximum you can contribute from July 1", value: fmt(result.maxContribution), highlight: true },
                    { label: "Contribution period", value: `${result.years} year${result.years !== 1 ? "s" : ""}`, highlight: false },
                    { label: "Your balance band", value: result.tsbBand === "full" ? "Under $1.84M" : result.tsbBand === "two" ? "$1.84M-$1.97M" : "$1.97M-$2.1M", highlight: false },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl border px-4 py-3 ${item.highlight ? "border-emerald-200 bg-emerald-50" : "border-neutral-200 bg-white"}`}>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{item.label}</p>
                      <p className={`font-serif text-xl font-bold ${item.highlight ? "text-emerald-700" : "text-neutral-950"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {result.tsbBand === "full" && age < 70 && (
                  <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3 mb-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Best strategy for your situation</p>
                    <p className="text-sm text-neutral-800">
                      Contribute {fmt(CAPS.NCC_2025)} before June 30, 2026 (without triggering bring-forward), then trigger the full {fmt(CAPS.BRING_3YR_2026)} from July 1, 2026.
                      Total: <strong>{fmt(CAPS.NCC_2025 + CAPS.BRING_3YR_2026)}</strong> into super across two financial years.
                    </p>
                  </div>
                )}

                {result.carryForwardEligible && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700 mb-1">⚠ Carry-forward alert — June 30 deadline</p>
                    <p className="text-sm text-amber-900">
                      Your balance is under $500,000 — you may have unused concessional cap amounts available from previous years. Critically, unused 2020-21 amounts expire permanently on June 30, 2026. Check myGov or ask your accountant now.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* CTA */}
            {(result.eligible || result.lockedOut) && (
              <div className="mt-4 rounded-xl border border-neutral-950 bg-neutral-950 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">What happens next</p>
                <h4 className="mt-2 font-serif text-xl font-bold text-white">
                  {result.lockedOut
                    ? "Understand what your locked-in period means and what you can still do."
                    : "Get the timing right. Contribute before June 30 or after July 1 — the sequence matters."}
                </h4>
                <button onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100">
                  Get My {effectiveTier === 147 ? "Planning" : "Decision"} Pack — ${effectiveTier} →
                </button>
                <p className="mt-2 text-xs text-neutral-500">One-time · ${effectiveTier} AUD · No subscription</p>
              </div>
            )}

            {/* Email save */}
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
          <p className="text-sm text-neutral-500 mb-6">5 quick questions — personalises the documents you receive.</p>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">When are you planning to make the contribution?</p>
              <div className="space-y-2">
                {[
                  { value: "before_june30", label: "Before June 30, 2026 — this financial year" },
                  { value: "after_july1", label: "After July 1, 2026 — next financial year" },
                  { value: "both", label: "Both — some before and some after" },
                  { value: "undecided", label: "Not decided yet — that is what I need help with" },
                ].map((o) => (
                  <Radio key={o.value} name="timing" value={o.value} current={answers.timing} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, timing: v }))} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Where is the money coming from?</p>
              <div className="space-y-2">
                {[
                  { value: "savings", label: "Personal savings or bank account" },
                  { value: "property_sale", label: "Proceeds from selling a property" },
                  { value: "inheritance", label: "Inheritance or estate proceeds" },
                  { value: "business", label: "Business sale proceeds" },
                  { value: "other", label: "Other" },
                ].map((o) => (
                  <Radio key={o.value} name="source_of_funds" value={o.value} current={answers.source_of_funds} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, source_of_funds: v }))} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Would this contribution push your super balance above $3 million?</p>
              <p className="mb-3 text-xs text-neutral-400">The new Division 296 tax applies to earnings above $3M from July 1 — worth checking before you contribute.</p>
              <div className="space-y-2">
                {[
                  { value: "no", label: "No — will stay well below $3M" },
                  { value: "close", label: "It might get close to $3M" },
                  { value: "yes", label: "Yes — it would push me over $3M" },
                  { value: "unsure", label: "Not sure — need to check" },
                ].map((o) => (
                  <Radio key={o.value} name="div296_risk" value={o.value} current={answers.div296_risk} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, div296_risk: v }))} />
                ))}
              </div>
              {answers.div296_risk === "yes" && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-900 font-semibold">⚠ Important. Contributing above $3M means future earnings on that portion attract the new Div 296 tax. Run the Div 296 Wealth Eraser calculator too before contributing.</p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">Do you have unused concessional (before-tax) contribution space from previous years?</p>
              <div className="space-y-2">
                {[
                  { value: "yes_2021", label: "Yes — I have unused space including from 2020-21 (urgent — expires June 30)" },
                  { value: "yes_recent", label: "Yes — from 2021-22 or later" },
                  { value: "no", label: "No — I have maxed out contributions most years" },
                  { value: "unsure", label: "Not sure — I need to check myGov" },
                ].map((o) => (
                  <Radio key={o.value} name="carry_forward" value={o.value} current={answers.carry_forward} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, carry_forward: v }))} />
                ))}
              </div>
              {answers.carry_forward === "yes_2021" && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-900 font-semibold">⚠ Urgent. 2020-21 carry-forward amounts expire permanently on June 30, 2026. This is included as a priority item in your pack.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="mb-3 text-sm font-semibold text-neutral-900">Which best describes where you are right now?</p>
              <div className="space-y-2">
                {[
                  { value: "understanding", label: "I need to understand my eligibility and the timing before doing anything" },
                  { value: "ready", label: "I am ready to contribute — I need the documents and scheduling plan" },
                ].map((o) => (
                  <Radio key={o.value} name="where_are_you" value={o.value} current={answers.where_are_you} label={o.label}
                    onChange={(v) => handleWhereAreYou(v as WhereAreYou)} />
                ))}
              </div>
              {answers.where_are_you === "understanding" && (
                <p className="mt-3 text-xs text-blue-800">→ You will receive the <strong>Decision Pack ($67)</strong> — eligibility assessment, timing strategy, and accountant brief.</p>
              )}
              {answers.where_are_you === "ready" && (
                <p className="mt-3 text-xs text-blue-800">→ You will receive the <strong>Planning Pack ($147)</strong> — full contribution scheduling, SMSF checklist, and implementation documents.</p>
              )}
            </div>

            {answersComplete && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">{product.name} — what you receive</p>
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
