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

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

// ── CALCULATION ────────────────────────────────────────────────────────────
function calcExposure(balance: number, costBase: number, marketValue: number) {
  const THRESHOLD = 3_000_000;
  const RATE = 0.15;
  const gain = Math.max(0, marketValue - costBase);
  const aboveThreshold = Math.max(0, balance - THRESHOLD);
  const proportion = balance > 0 ? aboveThreshold / balance : 0;
  const saving = gain * RATE * proportion;
  // Tax OWED without reset (what they lose if they do nothing)
  const taxIfNothing = gain * RATE * proportion;
  const score = Math.min(100, Math.round((saving / 300_000) * 100));
  // $75,000 split
  const tier: 67 | 147 = saving >= 75_000 ? 147 : 67;
  const exposurePct = balance > 0 ? fmtPct(proportion * 100) : "0%";
  return { gain, saving, taxIfNothing, score, tier, proportion, exposurePct };
}

// ── PRODUCT NAMES ──────────────────────────────────────────────────────────
const PRODUCTS = {
  67: {
    name: "Div 296 Decision Pack",
    tagline: "Should I elect? And if so, how?",
    files: [
      "Your personal reset vs. no-reset decision model",
      "All-or-nothing risk assessment for your fund",
      "June 30 valuation checklist — what to get valued and when",
      "Director Minute template — document your decision either way",
      "Briefing document for your SMSF accountant",
      "Loss-position asset guide — what to do if any asset is underwater",
    ],
    outcome: "One outcome: you know exactly what to do before June 30.",
  },
  147: {
    name: "Div 296 Election Pack",
    tagline: "I'm electing. Give me everything to lodge correctly.",
    files: [
      "Everything in the Decision Pack (files 1–6)",
      "ATO Approved Form Template — the actual election form, ready to complete",
      "Trustee Resolution — all trustees sign this to record the fund's decision",
      "Asset Valuation Record — template for recording June 30 market values (required for 5 years)",
      "Two-Cost-Base Record System — how to track Div 296 cost base separately from normal SMSF records",
    ],
    outcome: "One outcome: you are ready to lodge the election correctly.",
  },
};

// ── CTA FUNCTIONS ──────────────────────────────────────────────────────────
function getPrimaryCta(tier: 67 | 147, saving: number) {
  if (tier === 147) return `Protect My ${fmt(saving)} — $147 →`;
  return `Get My Decision Pack — $67 →`;
}

function getVerdictHeadline(tier: 67 | 147, saving: number) {
  if (tier === 147)
    return `High exposure. Your avoidable Div 296 tax is ${fmt(saving)}.`;
  return `Exposure confirmed. Your avoidable tax is ${fmt(saving)}.`;
}

function getVerdictBody(tier: 67 | 147, saving: number, taxIfNothing: number) {
  if (tier === 147)
    return `Without the cost-base reset, when you eventually sell this asset your estimated additional Div 296 tax bill will be approximately ${fmt(taxIfNothing)}. Miss June 30 and this becomes permanent. The all-or-nothing election needs to be structured correctly before you lodge.`;
  return `The cost-base reset election still applies to your fund. Before you commit to an irrevocable all-or-nothing decision, you need to understand whether it is right for your specific situation — particularly if any assets are worth less than you paid for them.`;
}

function getModalHeadline(tier: 67 | 147, saving: number) {
  if (tier === 147)
    return `Your ${fmt(saving)} avoidable tax. Here is how to protect it.`;
  return `Make the right decision before June 30.`;
}

function getQuestionnaireCta(tier: 67 | 147) {
  if (tier === 147) return "Continue to Payment — $147 →";
  return "Continue to Payment — $67 →";
}

// ── SLIDER ─────────────────────────────────────────────────────────────────
function Slider({ label, sublabel, min, max, step, value, onChange, format }: {
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

// ── QUESTION TYPES ─────────────────────────────────────────────────────────
type AccountantDiscussed = "" | "yes" | "no" | "no_accountant";
type ValuationReady = "" | "yes" | "no" | "not_sure";
type LossAssets = "" | "yes" | "no" | "not_sure";
type RecordsAvailable = "" | "yes" | "no" | "incomplete";
type WhereAreYou = "" | "deciding" | "ready";

interface Answers {
  accountant_discussed: AccountantDiscussed;
  valuation_ready: ValuationReady;
  loss_assets: LossAssets;
  records_available: RecordsAvailable;
  where_are_you: WhereAreYou;
}

const INITIAL_ANSWERS: Answers = {
  accountant_discussed: "",
  valuation_ready: "",
  loss_assets: "",
  records_available: "",
  where_are_you: "",
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function Div296WealthEraserCalculator() {
  const [balance, setBalance] = useState(4_500_000);
  const [costBase, setCostBase] = useState(800_000);
  const [marketValue, setMarketValue] = useState(2_400_000);

  const [hasResult, setHasResult] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  // Q5 can override the tier from calc
  const [overrideTier, setOverrideTier] = useState<67 | 147 | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const questionnaireRef = useRef<HTMLDivElement>(null);

  const calc = calcExposure(balance, costBase, marketValue);
  // Use override tier if user self-selected in Q5
  const effectiveTier: 67 | 147 = overrideTier ?? calc.tier;
  const product = PRODUCTS[effectiveTier];

  const answersComplete =
    answers.accountant_discussed !== "" &&
    answers.valuation_ready !== "" &&
    answers.loss_assets !== "" &&
    answers.records_available !== "" &&
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

  // Q5 self-selection overrides tier
  function handleWhereAreYou(v: WhereAreYou) {
    setAnswers(a => ({ ...a, where_are_you: v }));
    if (v === "deciding") setOverrideTier(67);
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
          product_slug: "div296-wealth-eraser",
          source_path: "/check/div296-wealth-eraser",
          inputs: { balance, cost_base: costBase, market_value: marketValue, email: email || null },
          output: calc,
          estimated_exposure: Math.round(calc.saving * 100),
          recommended_tier: calc.tier,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSessionId(data.id);
        localStorage.setItem("d296_session_id", data.id);
        localStorage.setItem("d296_result", JSON.stringify({
          balance, costBase, marketValue, ...calc, email: email || null,
        }));
      }
    } catch { /* non-blocking */ }
  }

  async function handleSaveEmail() {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, balance, source: "div296_result" }),
    }).catch(() => {});
    setEmailSent(true);
  }

  async function handleContinueToPayment() {
    if (!answersComplete || checkoutLoading) return;
    const sid = sessionId || localStorage.getItem("d296_session_id");
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
          product_key: `supertax_${effectiveTier}_div296_wealth_eraser`,
          personalise_answers: answers,
          email: email || undefined,
        }),
      });

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_session_id: sid,
          tier: effectiveTier,
          product_key: `supertax_${effectiveTier}_div296_wealth_eraser`,
          success_url: `${window.location.origin}/check/div296-wealth-eraser/success/${effectiveTier === 147 ? "execute" : "prepare"}`,
          cancel_url: `${window.location.origin}/check/div296-wealth-eraser`,
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

  const isHigh = effectiveTier === 147;
  const resultBg = isHigh ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50";

  // Price anchor: saving vs price
  const priceAnchor = calc.saving > 0
    ? `$${effectiveTier} is ${((effectiveTier / calc.saving) * 100).toFixed(1)}% of the ${fmt(calc.saving)} you are protecting`
    : null;

  return (
    <div id="calculator" className="scroll-mt-8 space-y-6">

      {/* ── CALCULATOR ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free calculator</p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
          Move the sliders to see your exposure
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          No payment required. Your number appears when you click below.
        </p>

        <div className="mt-8 space-y-8">
          <Slider
            label="Your total super balance"
            sublabel="Add up all your super accounts across all funds"
            min={3_000_000} max={20_000_000} step={100_000}
            value={balance} onChange={setBalance} format={fmt}
          />
          <Slider
            label="What did your SMSF (Self-Managed Super Fund) pay for its main asset?"
            sublabel="The original purchase price — property, shares, or other investment"
            min={100_000} max={5_000_000} step={50_000}
            value={costBase} onChange={setCostBase} format={fmt}
          />
          <Slider
            label="What is that asset worth today?"
            sublabel="Your best estimate of its market value at 30 June 2026"
            min={100_000} max={10_000_000} step={50_000}
            value={marketValue} onChange={setMarketValue} format={fmt}
          />
        </div>

        <button
          onClick={handleCalculate}
          className="mt-8 w-full rounded-xl bg-neutral-950 py-4 text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          Show My Div 296 Exposure →
        </button>
        <p className="mt-2 text-center text-xs text-neutral-400">
          Free. No payment required to see your result.
        </p>
      </div>

      {/* ── RESULT ── */}
      {hasResult && (
        <div ref={resultRef} className={`scroll-mt-8 rounded-2xl border p-6 sm:p-8 ${resultBg}`}>

          {/* Score + headline */}
          <div className="flex items-start gap-5">
            <div className={`flex flex-col items-center rounded-xl border-4 px-4 py-3 text-center ${isHigh ? "border-red-300 bg-red-100" : "border-amber-300 bg-amber-100"}`}>
              <span className={`font-serif text-4xl font-bold leading-none ${isHigh ? "text-red-700" : "text-amber-700"}`}>
                {calc.score}
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-neutral-400">/100</span>
            </div>
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Your result</p>
              <h3 className="mt-1 font-serif text-2xl font-bold leading-tight text-neutral-950">
                {getVerdictHeadline(effectiveTier, calc.saving)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {getVerdictBody(effectiveTier, calc.saving, calc.taxIfNothing)}
              </p>
            </div>
          </div>

          {/* Numbers */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-400">Pre-2026 gain at risk</p>
              <p className="mt-1 font-serif text-xl font-bold text-neutral-950">{fmt(calc.gain)}</p>
            </div>
            <div className={`rounded-xl border p-4 ${isHigh ? "border-red-200 bg-red-50" : "border-amber-100 bg-amber-50"}`}>
              <p className={`text-xs ${isHigh ? "text-red-600" : "text-amber-700"}`}>
                Your avoidable Div 296 tax
              </p>
              <p className={`mt-1 font-serif text-xl font-bold ${isHigh ? "text-red-700" : "text-amber-800"}`}>
                {fmt(calc.saving)}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs text-neutral-400">If you miss June 30</p>
              <p className="mt-1 font-serif text-xl font-bold text-neutral-950">Lost forever</p>
            </div>
          </div>

          {/* Exposure bar */}
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Proportion of your super above $3M threshold</span>
              <span className="font-mono font-bold text-neutral-950">{calc.exposurePct}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-3 rounded-full transition-all ${isHigh ? "bg-red-500" : "bg-amber-400"}`}
                style={{ width: `${Math.min(100, calc.proportion * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-neutral-400">
              <span>$3M threshold</span>
              <span>Your balance: {fmt(balance)}</span>
            </div>
          </div>

          {/* All-or-nothing warning */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-amber-900">⚠ All-or-nothing election</p>
            <p className="mt-0.5 text-sm text-amber-800">
              If your SMSF (Self-Managed Super Fund) holds any asset in a loss position at June 30, that cost base also resets lower. This decision requires careful review before you commit.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="mt-6 rounded-xl border border-neutral-950 bg-neutral-950 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              {isHigh ? "Your exposure is significant" : "Make the right decision first"}
            </p>
            <h4 className="mt-2 font-serif text-lg font-bold text-white">
              {getModalHeadline(effectiveTier, calc.saving)}
            </h4>
            <div className="mt-3 space-y-1">
              {product.files.slice(0, 3).map((f, i) => (
                <p key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                  <span className="mt-0.5 text-emerald-400">✓</span>{f}
                </p>
              ))}
              <p className="text-xs text-neutral-500">+ {product.files.length - 3} more files</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100"
            >
              {getPrimaryCta(effectiveTier, calc.saving)}
            </button>
            <p className="mt-2 text-xs text-neutral-500">
              One-time payment · ${effectiveTier} AUD · No subscription
            </p>
            {priceAnchor && (
              <p className="mt-1 text-xs text-neutral-600">{priceAnchor}</p>
            )}
          </div>

          {/* Email save */}
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-xs text-neutral-500 mb-2">
              Save this result — we will email you a summary and remind you as June 30 approaches.
            </p>
            {!emailSent ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
                <button
                  onClick={handleSaveEmail}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Save result
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Result saved. We will remind you before June 30.
              </p>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        </div>
      )}

      {/* ── QUESTIONNAIRE ── */}
      {showQuestionnaire && (
        <div ref={questionnaireRef} className="scroll-mt-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">

          {/* Header with their number */}
          <div className="mb-6 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-800">
              You are about to protect{" "}
              <span className={`font-bold ${isHigh ? "text-red-700" : "text-amber-700"}`}>
                {fmt(calc.saving)}
              </span>{" "}
              in avoidable Div 296 tax.
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

            {/* Q1 */}
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Has your accountant discussed Division 296 with you?
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

            {/* Q2 */}
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Do you have an independent valuation of your SMSF (Self-Managed Super Fund) assets arranged for June 30?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — valuation is in progress or arranged" },
                  { value: "no", label: "No — I have not arranged one yet" },
                  { value: "not_sure", label: "Not sure — I need to check" },
                ].map((o) => (
                  <Radio key={o.value} name="valuation_ready" value={o.value}
                    current={answers.valuation_ready} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, valuation_ready: v as ValuationReady }))}
                  />
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Does your SMSF (Self-Managed Super Fund) hold any assets currently worth{" "}
                <strong>less</strong> than what you originally paid for them?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — at least one asset has dropped in value" },
                  { value: "no", label: "No — all assets are worth more than I paid" },
                  { value: "not_sure", label: "Not sure — I need to check" },
                ].map((o) => (
                  <Radio key={o.value} name="loss_assets" value={o.value}
                    current={answers.loss_assets} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, loss_assets: v as LossAssets }))}
                  />
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-900">
                Are your original purchase records for your SMSF assets available?
              </p>
              <div className="space-y-2">
                {[
                  { value: "yes", label: "Yes — records are complete and available" },
                  { value: "incomplete", label: "Partially — some records are missing or unclear" },
                  { value: "no", label: "No — records are not readily available" },
                ].map((o) => (
                  <Radio key={o.value} name="records_available" value={o.value}
                    current={answers.records_available} label={o.label}
                    onChange={(v) => setAnswers(a => ({ ...a, records_available: v as RecordsAvailable }))}
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
                  { value: "deciding", label: "I am still deciding whether the election is right for my fund" },
                  { value: "ready", label: "I have decided to elect — I need the forms and documents to lodge correctly" },
                ].map((o) => (
                  <Radio key={o.value} name="where_are_you" value={o.value}
                    current={answers.where_are_you} label={o.label}
                    onChange={(v) => handleWhereAreYou(v as WhereAreYou)}
                  />
                ))}
              </div>
              {answers.where_are_you === "deciding" && (
                <p className="mt-3 text-xs text-blue-800">
                  → You will receive the <strong>Div 296 Decision Pack ($67)</strong> — everything you need to make the right decision before committing.
                </p>
              )}
              {answers.where_are_you === "ready" && (
                <p className="mt-3 text-xs text-blue-800">
                  → You will receive the <strong>Div 296 Election Pack ($147)</strong> — the approved form, resolution, record system, and accountant brief.
                </p>
              )}
            </div>

            {/* What they will receive */}
            {answersComplete && (
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
              {checkoutLoading ? "Redirecting to payment..." : getQuestionnaireCta(effectiveTier)}
            </button>

            {priceAnchor && answersComplete && (
              <p className="text-center text-xs text-neutral-400">{priceAnchor}</p>
            )}

            {error && <p className="text-sm text-red-700">{error}</p>}
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Before you continue
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-neutral-950">
              {getModalHeadline(effectiveTier, calc.saving)}
            </h3>

            {/* Product contents */}
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
                {effectiveTier === 147 ? "Continue to My Election Pack →" : "Continue to My Decision Pack →"}
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
