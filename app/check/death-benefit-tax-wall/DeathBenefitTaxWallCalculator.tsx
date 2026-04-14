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

const fmtPct = (n: number) => `${n.toFixed(0)}%`;

// ── CALCULATIONS ───────────────────────────────────────────────────────────

// PANEL 1: If YOU die — death benefit tax wall for adult children
function calcDeathBenefitTax(
  balance: number,
  taxablePct: number,
  numChildren: number
) {
  const taxableAmount = balance * (taxablePct / 100);
  const taxFreeAmount = balance - taxableAmount;
  const totalTax = taxableAmount * 0.17; // 15% + 2% Medicare
  const totalTaxViaEstate = taxableAmount * 0.15; // via estate — no Medicare
  const taxPerChild = numChildren > 0 ? totalTax / numChildren : 0;
  const familyKeeps = balance - totalTax;
  const score = Math.min(100, Math.round((totalTax / 500_000) * 100));
  return {
    taxableAmount,
    taxFreeAmount,
    totalTax,
    totalTaxViaEstate,
    taxPerChild,
    familyKeeps,
    score,
  };
}

// PANEL 2: If PARTNER dies — Div 296 survivorship risk
function calcSurvivorshipRisk(
  yourBalance: number,
  partnerBalance: number,
  pensionType: string
) {
  const THRESHOLD = 3_000_000;
  const isReversionary = pensionType === "reversionary";
  const isNotSure = pensionType === "not_sure";

  // If reversionary: your TSB jumps immediately
  const combinedTSB = yourBalance + (isReversionary || isNotSure ? partnerBalance : 0);
  const wasAlreadyOver = yourBalance > THRESHOLD;
  const nowOver = combinedTSB > THRESHOLD;
  const amountOver = Math.max(0, combinedTSB - THRESHOLD);
  const proportion = combinedTSB > 0 ? amountOver / combinedTSB : 0;

  // Estimated annual Div 296 tax (assume 7% return)
  const estimatedEarnings = combinedTSB * 0.07;
  const div296Tax = estimatedEarnings * proportion * 0.15;

  return {
    combinedTSB,
    wasAlreadyOver,
    nowOver,
    amountOver,
    proportion,
    div296Tax,
    isReversionary,
    isNotSure,
    partnerIncluded: isReversionary || isNotSure,
  };
}

// ── TIER LOGIC ─────────────────────────────────────────────────────────────
function getTier(totalTax: number, div296Tax: number): "email" | 67 | 147 {
  const combined = totalTax + div296Tax * 5; // 5-year Div 296 exposure
  if (combined >= 200_000) return 147;
  if (combined >= 50_000) return 67;
  return "email";
}

// ── CTA FUNCTIONS ──────────────────────────────────────────────────────────
function getPrimaryCta(tier: "email" | 67 | 147, totalTax: number) {
  if (tier === 147) return `Protect My Family — ${fmt(totalTax)} at risk — $147 →`;
  if (tier === 67) return `Get My Decision Pack — $67 →`;
  return "Save My Result →";
}

function getVerdictHeadline(tier: "email" | 67 | 147, totalTax: number) {
  if (tier === 147)
    return `Your family faces ${fmt(totalTax)} in avoidable tax. This needs fixing now.`;
  if (tier === 67)
    return `Your family faces ${fmt(totalTax)} in avoidable tax. Understand your options first.`;
  return "Your current exposure is low. Save this result.";
}

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
        <p className="shrink-0 font-serif text-xl font-bold text-neutral-950">
          {format(value)}
        </p>
      </div>
      <div className="relative h-2 rounded-full bg-neutral-200">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-neutral-950 transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-neutral-950 bg-white shadow transition-all"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ── TYPES ──────────────────────────────────────────────────────────────────
type PensionType = "reversionary" | "non_reversionary" | "not_sure" | "no_pension";
type AccountantDiscussed = "" | "yes" | "no" | "no_accountant";
type RecontributionDone = "" | "yes" | "partial" | "no" | "not_eligible";
type BDBNStatus = "" | "valid" | "expired" | "none" | "not_sure";
type EstatePlanning = "" | "yes" | "partial" | "no";
type WhereAreYou = "" | "understanding" | "ready";

interface Answers {
  accountant_discussed: AccountantDiscussed;
  recontribution_done: RecontributionDone;
  bdbn_status: BDBNStatus;
  estate_planning: EstatePlanning;
  where_are_you: WhereAreYou;
}

const INITIAL_ANSWERS: Answers = {
  accountant_discussed: "",
  recontribution_done: "",
  bdbn_status: "",
  estate_planning: "",
  where_are_you: "",
};

const PRODUCTS = {
  67: {
    name: "Death Benefit Tax-Wall Decision Pack",
    tagline: "What is my exposure and can I reduce it?",
    files: [
      "Your personal tax-wall calculation — exact dollars per child",
      "Recontribution strategy guide — can you still do it and how much can you convert?",
      "Tax component analysis checklist — what to ask your SMSF accountant",
      "BDBN review guide — what your nomination does and does not protect against",
      "Trust deed review checklist — in-specie transfer provisions and property traps",
      "Accountant briefing document — what your SMSF accountant needs to model",
    ],
    outcome: "One outcome: you know your exact tax wall and whether you can reduce it.",
  },
  147: {
    name: "Death Benefit Tax-Wall Planning Pack",
    tagline: "Give me everything to fix this.",
    files: [
      "Everything in the Decision Pack (files 1–6)",
      "Recontribution implementation plan — step-by-step for your balance and eligibility",
      "Non-concessional contribution strategy — annual schedule to maximise conversion",
      "Superannuation Testamentary Trust briefing — what it is and what to ask your solicitor",
      "Two-problem tracker — Div 296 AND death benefit tax-wall combined impact on your estate",
    ],
    outcome: "One outcome: a documented plan to reduce your family's tax exposure.",
  },
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function DeathBenefitTaxWallCalculator() {
  // Your details
  const [yourBalance, setYourBalance] = useState(2_000_000);
  const [taxablePct, setTaxablePct] = useState(80);
  const [numChildren, setNumChildren] = useState(2);

  // Partner details
  const [partnerBalance, setPartnerBalance] = useState(1_500_000);
  const [pensionType, setPensionType] = useState<PensionType>("not_sure");

  // UI state
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

  // Live calculations
  const panel1 = calcDeathBenefitTax(yourBalance, taxablePct, numChildren);
  const panel2 = calcSurvivorshipRisk(yourBalance, partnerBalance, pensionType);
  const combinedExposure = panel1.totalTax + panel2.div296Tax * 5;
  const calcTier = getTier(panel1.totalTax, panel2.div296Tax);
  const effectiveTier: "email" | 67 | 147 = overrideTier ?? calcTier;
  const product = effectiveTier !== "email" ? PRODUCTS[effectiveTier] : null;

  const answersComplete =
    answers.accountant_discussed !== "" &&
    answers.recontribution_done !== "" &&
    answers.bdbn_status !== "" &&
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
          product_slug: "death-benefit-tax-wall",
          source_path: "/check/death-benefit-tax-wall",
          inputs: {
            your_balance: yourBalance,
            taxable_pct: taxablePct,
            num_children: numChildren,
            partner_balance: partnerBalance,
            pension_type: pensionType,
          },
          output: {
            panel1_total_tax: Math.round(panel1.totalTax),
            panel1_per_child: Math.round(panel1.taxPerChild),
            panel2_combined_tsb: Math.round(panel2.combinedTSB),
            panel2_div296_annual: Math.round(panel2.div296Tax),
            combined_exposure: Math.round(combinedExposure),
            recommended_tier: effectiveTier,
          },
          estimated_exposure: Math.round(combinedExposure * 100),
          recommended_tier: effectiveTier === "email" ? 67 : effectiveTier,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSessionId(data.id);
        localStorage.setItem("dbtw_session_id", data.id);
      }
    } catch { /* non-blocking */ }
  }

  async function handleSaveEmail() {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        balance: yourBalance,
        source: "death_benefit_tax_wall_result",
      }),
    }).catch(() => {});
    setEmailSent(true);
  }

  async function handleContinueToPayment() {
    if (!answersComplete || checkoutLoading) return;
    const sid = sessionId || localStorage.getItem("dbtw_session_id");
    if (!sid) { setError("Session expired. Run the calculator again."); return; }
    if (effectiveTier === "email") return;

    setCheckoutLoading(true);
    setError("");

    try {
      await fetch("/api/decision-sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sid,
          tier_intended: effectiveTier,
          product_key: `supertax_${effectiveTier}_death_benefit_tax_wall`,
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
          product_key: `supertax_${effectiveTier}_death_benefit_tax_wall`,
          success_url: `${window.location.origin}/check/death-benefit-tax-wall/success/${effectiveTier === 147 ? "execute" : "prepare"}`,
          cancel_url: `${window.location.origin}/check/death-benefit-tax-wall`,
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

  const isHighRisk = effectiveTier === 147;
  const resultBg = isHighRisk ? "border-red-200 bg-red-50" : effectiveTier === 67 ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50";

  const priceAnchor = effectiveTier !== "email" && panel1.totalTax > 0
    ? `$${effectiveTier} is ${((effectiveTier / panel1.totalTax) * 100).toFixed(1)}% of the ${fmt(panel1.totalTax)} your family is exposed to`
    : null;

  return (
    <div id="calculator" className="scroll-mt-8 space-y-6">

      {/* ── CALCULATOR ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free calculator</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
          Enter your numbers to see both risks
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          No payment required. Your result appears when you click below.
        </p>

        {/* YOUR DETAILS */}
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Your SMSF details
            </p>
            <div className="space-y-6">
              <Slider
                label="Your total super balance"
                sublabel="Across all your super accounts"
                min={200_000} max={5_000_000} step={50_000}
                value={yourBalance} onChange={setYourBalance} format={fmt}
              />
              <Slider
                label="Your taxable component"
                sublabel="Most SMSF members: 70-90%. Check your member statement."
                min={50} max={100} step={5}
                value={taxablePct} onChange={setTaxablePct}
                format={(v) => `${v}%`}
              />
              <div>
                <p className="mb-3 text-sm font-semibold text-neutral-800">
                  Number of adult children beneficiaries
                </p>
                <p className="mb-3 text-xs text-neutral-400">
                  Adult children over 18 who are financially independent
                </p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumChildren(n)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${numChildren === n ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"}`}
                    >
                      {n === 4 ? "4+" : n}
                    </button>
                  ))}
                </div>
                {numChildren === 0 && (
                  <p className="mt-2 text-xs text-emerald-700">
                    ✓ No adult children — death benefit tax-wall does not apply to you.
                    We will still model the Div 296 survivorship risk below.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* PARTNER DETAILS */}
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Your spouse / partner details
            </p>
            <div className="space-y-6">
              <Slider
                label="Your partner's super balance"
                sublabel="Their total across all super accounts"
                min={0} max={5_000_000} step={50_000}
                value={partnerBalance} onChange={setPartnerBalance} format={fmt}
              />
              <div>
                <p className="mb-3 text-sm font-semibold text-neutral-800">
                  If your partner dies, how is their pension set up?
                </p>
                <p className="mb-3 text-xs text-neutral-400">
                  A reversionary pension automatically transfers to you — adding to your Total Super Balance immediately with no grace period for Division 296 purposes.
                </p>
                <div className="space-y-2">
                  {[
                    { value: "reversionary", label: "Reversionary — it automatically continues to me" },
                    { value: "non_reversionary", label: "Non-reversionary — it stops and is paid as a lump sum" },
                    { value: "not_sure", label: "Not sure — I need to check" },
                    { value: "no_pension", label: "My partner is not yet in pension phase" },
                  ].map((o) => (
                    <Radio
                      key={o.value}
                      name="pension_type"
                      value={o.value}
                      current={pensionType}
                      label={o.label}
                      onChange={(v) => setPensionType(v as PensionType)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-8 w-full rounded-xl bg-neutral-950 py-4 text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          Show My Family's Tax Exposure →
        </button>
        <p className="mt-2 text-center text-xs text-neutral-400">
          Free. No payment required to see your result.
        </p>
      </div>

      {/* ── RESULT ── */}
      {hasResult && (
        <div ref={resultRef} className={`scroll-mt-8 rounded-2xl border p-6 sm:p-8 ${resultBg}`}>

          {/* Headline */}
          <div className="mb-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Your result</p>
            <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-neutral-950">
              {getVerdictHeadline(effectiveTier, panel1.totalTax)}
            </h3>
          </div>

          {/* TWO PANELS */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* PANEL 1 — Death benefit tax wall */}
            <div className={`rounded-xl border p-5 ${numChildren === 0 ? "border-emerald-200 bg-emerald-50" : isHighRisk ? "border-red-200 bg-red-50" : "border-amber-100 bg-amber-50"}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${numChildren === 0 ? "bg-emerald-500" : isHighRisk ? "bg-red-500" : "bg-amber-500"}`} />
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  If you die first
                </p>
              </div>
              <p className="font-serif text-lg font-bold text-neutral-950 mb-3">
                Death Benefit Tax-Wall
              </p>
              {numChildren === 0 ? (
                <p className="text-sm text-emerald-700">
                  ✓ No adult children beneficiaries. Death benefit tax-wall does not apply.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2">
                    <p className="text-xs text-neutral-500">Your taxable component</p>
                    <p className="font-mono text-sm font-bold text-neutral-950">{fmt(panel1.taxableAmount)}</p>
                  </div>
                  <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${isHighRisk ? "border-red-200 bg-white" : "border-amber-200 bg-white"}`}>
                    <p className={`text-xs ${isHighRisk ? "text-red-600" : "text-amber-700"}`}>
                      Total tax to ATO
                    </p>
                    <p className={`font-mono text-sm font-bold ${isHighRisk ? "text-red-700" : "text-amber-800"}`}>
                      {fmt(panel1.totalTax)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2">
                    <p className="text-xs text-neutral-500">
                      Per child ({numChildren} {numChildren === 1 ? "child" : "children"})
                    </p>
                    <p className="font-mono text-sm font-bold text-neutral-950">{fmt(panel1.taxPerChild)}</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-xs text-emerald-700">Your family keeps</p>
                    <p className="font-mono text-sm font-bold text-emerald-700">{fmt(panel1.familyKeeps)}</p>
                  </div>
                  <p className="text-[11px] text-neutral-400 pt-1">
                    Rate: 17% (15% + 2% Medicare) on taxable component.
                    Via estate: 15% (no Medicare levy) = {fmt(panel1.totalTaxViaEstate)}.
                    Source: ITAA 1997.
                  </p>
                </div>
              )}
            </div>

            {/* PANEL 2 — Div 296 survivorship */}
            <div className={`rounded-xl border p-5 ${!panel2.partnerIncluded ? "border-neutral-200 bg-neutral-50" : panel2.nowOver ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${!panel2.partnerIncluded ? "bg-neutral-400" : panel2.nowOver ? "bg-red-500" : "bg-emerald-500"}`} />
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  If your partner dies first
                </p>
              </div>
              <p className="font-serif text-lg font-bold text-neutral-950 mb-3">
                Div 296 Survivorship Risk
              </p>
              {pensionType === "no_pension" ? (
                <p className="text-sm text-neutral-500">
                  Partner not yet in pension phase. Model this when pension commences.
                </p>
              ) : !panel2.partnerIncluded ? (
                <p className="text-sm text-neutral-500">
                  Non-reversionary pension — partner's balance does not add to your TSB on death.
                  Div 296 survivorship risk is low.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2">
                    <p className="text-xs text-neutral-500">Your TSB after reversion</p>
                    <p className="font-mono text-sm font-bold text-neutral-950">{fmt(panel2.combinedTSB)}</p>
                  </div>
                  <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${panel2.nowOver ? "border-red-200 bg-white" : "border-emerald-200 bg-white"}`}>
                    <p className={`text-xs ${panel2.nowOver ? "text-red-600" : "text-emerald-700"}`}>
                      $3M threshold crossed?
                    </p>
                    <p className={`font-mono text-sm font-bold ${panel2.nowOver ? "text-red-700" : "text-emerald-700"}`}>
                      {panel2.nowOver ? "YES" : "NO"}
                    </p>
                  </div>
                  {panel2.nowOver && (
                    <>
                      <div className="flex items-center justify-between rounded-lg border border-red-200 bg-white px-3 py-2">
                        <p className="text-xs text-red-600">Amount above $3M</p>
                        <p className="font-mono text-sm font-bold text-red-700">{fmt(panel2.amountOver)}</p>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-red-100 bg-white px-3 py-2">
                        <p className="text-xs text-neutral-500">Est. annual Div 296 tax</p>
                        <p className="font-mono text-sm font-bold text-neutral-950">{fmt(panel2.div296Tax)}</p>
                      </div>
                    </>
                  )}
                  {panel2.isNotSure && (
                    <p className="text-[11px] text-amber-700 pt-1">
                      ⚠ Modelled as reversionary (worst case). Check your pension documents.
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-400 pt-1">
                    TSB increases immediately from date of death. No grace period for Div 296.
                    Source: Division 296 Act s.13, enacted 10 March 2026.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* COMBINED SUMMARY */}
          {effectiveTier !== "email" && (
            <div className="mt-4 rounded-xl border border-neutral-950 bg-neutral-950 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                Combined family tax exposure
              </p>
              <h4 className="mt-2 font-serif text-xl font-bold text-white">
                {numChildren > 0 && panel2.nowOver
                  ? `Your family faces ${fmt(panel1.totalTax)} in death benefit tax plus ${fmt(panel2.div296Tax)} per year in Div 296 tax.`
                  : numChildren > 0
                  ? `Your family faces ${fmt(panel1.totalTax)} in avoidable death benefit tax.`
                  : `Your family faces ${fmt(panel2.div296Tax)} per year in additional Div 296 tax.`}
              </h4>
              <p className="mt-2 text-sm text-neutral-300">
                Most of this is avoidable with the right structure. The window to act is open now.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100"
              >
                {getPrimaryCta(effectiveTier, panel1.totalTax)}
              </button>
              <p className="mt-2 text-xs text-neutral-500">
                One-time payment · ${effectiveTier} AUD · No subscription
              </p>
              {priceAnchor && (
                <p className="mt-1 text-xs text-neutral-600">{priceAnchor}</p>
              )}
            </div>
          )}

          {/* EMAIL CAPTURE */}
          {effectiveTier === "email" && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4">
              <p className="text-sm font-semibold text-neutral-800 mb-1">
                Your current exposure is low.
              </p>
              <p className="text-xs text-neutral-500 mb-3">
                Save this result — we will send a summary and alert you if your situation changes.
              </p>
              {!emailSent ? (
                <div className="flex gap-2">
                  <input
                    type="email" placeholder="Your email address" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                  <button onClick={handleSaveEmail} className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                    Save result
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-emerald-700">✓ Result saved.</p>
              )}
            </div>
          )}

          {/* EMAIL SAVE (for paid tiers) */}
          {effectiveTier !== "email" && (
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-500 mb-2">
                Save this result — we will email a summary and remind you to act.
              </p>
              {!emailSent ? (
                <div className="flex gap-2">
                  <input
                    type="email" placeholder="Your email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                  <button onClick={handleSaveEmail} className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                    Save result
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-emerald-700">✓ Result saved.</p>
              )}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      )}

      {/* ── QUESTIONNAIRE ── */}
      {showQuestionnaire && effectiveTier !== "email" && product && (
        <div ref={questionnaireRef} className="scroll-mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="mb-6 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-800">
              Your family's exposure:{" "}
              <span className={`font-bold ${isHighRisk ? "text-red-700" : "text-amber-700"}`}>
                {fmt(panel1.totalTax)}
              </span>{" "}
              in death benefit tax
              {panel2.nowOver && ` + ${fmt(panel2.div296Tax)}/year in Div 296 tax`}.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              5 quick questions — your answers personalise the documents you receive.
            </p>
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-1">
            {product.name} — ${effectiveTier}
          </p>
          <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-6">
            Tell us about your situation
          </h3>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Has your accountant discussed the death benefit tax-wall with you?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — we have discussed it" },
                  { value: "no", label: "No — they have not raised it" },
                  { value: "no_accountant", label: "I do not have an SMSF (Self-Managed Super Fund) accountant" },
                ].map((o) => (
                  <Radio key={o.value} name="accountant_discussed" value={o.value}
                    current={answers.accountant_discussed} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, accountant_discussed: v as AccountantDiscussed }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Have you done a recontribution strategy to reduce your taxable component?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — already done" },
                  { value: "partial", label: "Partially — done some but not all" },
                  { value: "no", label: "No — not done yet" },
                  { value: "not_eligible", label: "Not sure if I am eligible" },
                ].map((o) => (
                  <Radio key={o.value} name="recontribution_done" value={o.value}
                    current={answers.recontribution_done} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, recontribution_done: v as RecontributionDone }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                What is the status of your Binding Death Benefit Nomination (BDBN)?
              </p>
              <div className="space-y-2">
                {[
                  { value: "valid", label: "Valid and current — renewed within 3 years" },
                  { value: "expired", label: "Expired — not renewed recently" },
                  { value: "none", label: "None in place" },
                  { value: "not_sure", label: "Not sure — need to check" },
                ].map((o) => (
                  <Radio key={o.value} name="bdbn_status" value={o.value}
                    current={answers.bdbn_status} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, bdbn_status: v as BDBNStatus }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Does your estate planning account for the death benefit tax your children will pay?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — our estate plan specifically addresses this" },
                  { value: "partial", label: "Partially — we have a Will but not specifically this" },
                  { value: "no", label: "No — this has not been considered" },
                ].map((o) => (
                  <Radio key={o.value} name="estate_planning" value={o.value}
                    current={answers.estate_planning} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, estate_planning: v as EstatePlanning }))}
                  />
                ))}
              </div>
            </div>

            {/* Q5 — self-selection magic question */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Which best describes where you are right now?
              </p>
              <div className="space-y-2">
                {[
                  { value: "understanding", label: "I need to understand the problem and my options before taking action" },
                  { value: "ready", label: "I understand the risk — I need a plan and documents to fix it" },
                ].map((o) => (
                  <Radio key={o.value} name="where_are_you" value={o.value}
                    current={answers.where_are_you} label={o.label}
                    onChange={(v) => handleWhereAreYou(v as WhereAreYou)}
                  />
                ))}
              </div>
              {answers.where_are_you === "understanding" && (
                <p className="mt-3 text-xs text-blue-800">
                  → You will receive the <strong>Death Benefit Tax-Wall Decision Pack ($67)</strong> — everything you need to understand your exposure and options.
                </p>
              )}
              {answers.where_are_you === "ready" && (
                <p className="mt-3 text-xs text-blue-800">
                  → You will receive the <strong>Death Benefit Tax-Wall Planning Pack ($147)</strong> — the recontribution strategy, BDBN review, and estate planning documents.
                </p>
              )}
            </div>

            {/* Product preview */}
            {answersComplete && product && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-2">
                  Your personalised pack — {product.name}
                </p>
                <p className="text-xs text-neutral-600 mb-3">{product.tagline}</p>
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

            <button
              onClick={handleContinueToPayment}
              disabled={!answersComplete || checkoutLoading}
              className="w-full rounded-xl bg-neutral-950 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
            >
              {checkoutLoading
                ? "Redirecting to payment..."
                : effectiveTier !== "email"
                ? `Continue to Payment — $${effectiveTier} →`
                : "Save My Result →"}
            </button>

            {priceAnchor && answersComplete && (
              <p className="text-center text-xs text-neutral-400">{priceAnchor}</p>
            )}
            {error && <p className="text-sm text-red-700">{error}</p>}
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && effectiveTier !== "email" && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Before you continue
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-neutral-950">
              {numChildren > 0
                ? `${fmt(panel1.totalTax)} to the ATO. Here is how to protect it.`
                : "Your Div 296 survivorship risk. Here is how to model it."}
            </h3>

            <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                {product.name} — what you receive
              </p>
              <ul className="space-y-1.5">
                {product.files.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{f}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold text-neutral-800">{product.outcome}</p>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <div>
                <p className="text-xs text-neutral-500">One-time payment · No subscription</p>
                <p className="mt-0.5 font-serif text-xl font-bold text-neutral-950">${effectiveTier} AUD</p>
              </div>
              {priceAnchor && (
                <p className="text-xs text-neutral-400 max-w-[180px] text-right">{priceAnchor}</p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => { setShowModal(false); setShowQuestionnaire(true); }}
                className="flex-1 rounded-xl bg-neutral-950 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                {effectiveTier === 147
                  ? "Continue to My Planning Pack →"
                  : "Continue to My Decision Pack →"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
