"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

function useCountdown(target: string) {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const t = new Date(target).getTime();
    const calc = () => setDays(Math.max(0, Math.floor((t - Date.now()) / 86400000)));
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [target]);
  return days;
}

// ── CALCULATION ────────────────────────────────────────────────────────────
function calcExposure(balance: number, costBase: number, marketValue: number) {
  const threshold = 3_000_000;
  const rate = 0.15;
  const gain = Math.max(0, marketValue - costBase);
  const aboveThreshold = Math.max(0, balance - threshold);
  const proportion = balance > 0 ? aboveThreshold / balance : 0;
  const saving = gain * rate * proportion;
  const score = Math.min(100, Math.round((saving / 300_000) * 100));
  const tier: 67 | 147 = saving >= 75_000 ? 147 : 67;
  return { gain, saving, score, tier };
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
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-800">{label}</p>
          {sublabel && <p className="text-xs text-neutral-400 mt-0.5">{sublabel}</p>}
        </div>
        <p className="font-serif text-xl font-bold text-neutral-950">{format(value)}</p>
      </div>
      <div className="relative h-2 rounded-full bg-neutral-200">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-neutral-950 transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-neutral-950 bg-white shadow transition-all"
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

// ── PERSONALISE MODAL ──────────────────────────────────────────────────────
type ValuationReady = "" | "yes" | "no" | "not_sure";
type LossAssets = "" | "yes" | "no" | "not_sure";
type TrusteeType = "" | "sole" | "joint";
type CostBaseDoc = "" | "yes" | "no" | "incomplete";

interface Answers {
  valuation_ready: ValuationReady;
  loss_assets: LossAssets;
  trustee_type: TrusteeType;
  cost_base_documented: CostBaseDoc;
}

function PersonaliseModal({
  tier, answers, setAnswers, onContinue, onClose, loading,
}: {
  tier: 67 | 147;
  answers: Answers;
  setAnswers: (a: Answers) => void;
  onContinue: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const complete =
    answers.valuation_ready !== "" &&
    answers.loss_assets !== "" &&
    answers.trustee_type !== "" &&
    answers.cost_base_documented !== "";

  function Radio({
    name, value, current, label, onChange,
  }: { name: string; value: string; current: string; label: string; onChange: (v: string) => void }) {
    return (
      <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${current === value ? "border-neutral-950 bg-neutral-50 font-medium" : "border-neutral-200 hover:border-neutral-300"}`}>
        <input type="radio" name={name} checked={current === value} onChange={() => onChange(value)} className="shrink-0 accent-neutral-950" />
        {label}
      </label>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-auto">
        <div className="mb-5">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            {tier === 147 ? "Full Lodgement Kit — $147" : "Decision Logic Pack — $67"}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
            Four quick questions
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Your answers personalise which documents you receive. 30 seconds.
          </p>
        </div>

        <div className="space-y-5">
          {/* Q1 */}
          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-900">
              Do you have an independent valuation of your SMSF assets arranged for June 30?
            </p>
            <div className="space-y-2">
              {[
                { value: "yes", label: "Yes — valuation is in progress or arranged" },
                { value: "no", label: "No — I have not arranged one yet" },
                { value: "not_sure", label: "Not sure — I need to check" },
              ].map((o) => (
                <Radio key={o.value} name="valuation_ready" value={o.value} current={answers.valuation_ready} label={o.label} onChange={(v) => setAnswers({ ...answers, valuation_ready: v as ValuationReady })} />
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-900">
              Does your SMSF hold any assets currently worth less than their purchase price?
            </p>
            <div className="space-y-2">
              {[
                { value: "yes", label: "Yes — at least one asset has an unrealised loss" },
                { value: "no", label: "No — all assets are above their original cost" },
                { value: "not_sure", label: "Not sure — I need to check" },
              ].map((o) => (
                <Radio key={o.value} name="loss_assets" value={o.value} current={answers.loss_assets} label={o.label} onChange={(v) => setAnswers({ ...answers, loss_assets: v as LossAssets })} />
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-900">
              Are your original purchase records clearly documented?
            </p>
            <div className="space-y-2">
              {[
                { value: "yes", label: "Yes — records are clear and complete" },
                { value: "no", label: "No — some records are missing" },
                { value: "incomplete", label: "Partially — some assets are documented" },
              ].map((o) => (
                <Radio key={o.value} name="cost_base_documented" value={o.value} current={answers.cost_base_documented} label={o.label} onChange={(v) => setAnswers({ ...answers, cost_base_documented: v as CostBaseDoc })} />
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-900">
              What is your trustee structure?
            </p>
            <div className="space-y-2">
              {[
                { value: "sole", label: "Sole trustee — I am the only trustee" },
                { value: "joint", label: "Joint trustees — multiple trustees must sign" },
              ].map((o) => (
                <Radio key={o.value} name="trustee_type" value={o.value} current={answers.trustee_type} label={o.label} onChange={(v) => setAnswers({ ...answers, trustee_type: v as TrusteeType })} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onContinue}
            disabled={!complete || loading}
            className="w-full rounded-xl bg-neutral-950 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
          >
            {loading ? "Redirecting to payment..." : `Continue to Payment — $${tier} AUD →`}
          </button>
          <button onClick={onClose} className="text-sm text-neutral-400 hover:text-neutral-600 transition">
            Not now — go back
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function CostBaseResetPage() {
  const daysLeft = useCountdown("2026-06-30");

  // Sliders
  const [balance, setBalance] = useState(4_500_000);
  const [costBase, setCostBase] = useState(800_000);
  const [marketValue, setMarketValue] = useState(2_400_000);

  // UI state
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Personalise
  const [answers, setAnswers] = useState<Answers>({
    valuation_ready: "",
    loss_assets: "",
    trustee_type: "",
    cost_base_documented: "",
  });

  const resultRef = useRef<HTMLDivElement>(null);

  // Live calculation (updates as sliders move)
  const calc = calcExposure(balance, costBase, marketValue);

  // Score ring color
  const scoreColor =
    calc.score >= 70 ? "text-red-600" : calc.score >= 40 ? "text-amber-600" : "text-blue-600";
  const scoreBg =
    calc.score >= 70 ? "border-red-200 bg-red-50" : calc.score >= 40 ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50";

  async function handleCalculate() {
    setHasCalculated(true);
    setError("");

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Save session
    try {
      const res = await fetch("/api/decision-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: "cost-base-reset",
          source_path: "/check/cost-base-reset",
          inputs: {
            balance,
            cost_base: costBase,
            market_value: marketValue,
            balance_tier: balance >= 10_000_000 ? "over10" : balance >= 5_000_000 ? "5to10" : "3to5",
            email: email || null,
          },
          output: calc,
          estimated_exposure: Math.round(calc.saving * 100),
          recommended_tier: calc.tier,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSessionId(data.id);
        localStorage.setItem("cbr_session_id", data.id);
        localStorage.setItem("cbr_result", JSON.stringify({
          balance, costBase, marketValue, ...calc, email: email || null,
        }));
      }
    } catch {
      // non-blocking — calc still shows
    }
  }

  async function handleSaveEmail() {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, balance, source: "cost_base_reset_result" }),
    });
    setEmailSaved(true);
  }

  async function handleContinueToPayment() {
    if (checkoutLoading) return;
    const sid = sessionId || localStorage.getItem("cbr_session_id");
    if (!sid) { setError("Session expired. Run the calculator again."); return; }

    setCheckoutLoading(true);
    setError("");

    try {
      // Update session with personalise answers
      await fetch("/api/decision-sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sid,
          tier_intended: calc.tier,
          product_key: `supertax_${calc.tier}_cost_base_reset`,
          personalise_answers: answers,
          email: email || undefined,
        }),
      });

      // Stripe checkout
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_session_id: sid,
          tier: calc.tier,
          product_key: `supertax_${calc.tier}_cost_base_reset`,
          success_url: `${window.location.origin}/check/cost-base-reset/success/${calc.tier === 147 ? "execute" : "prepare"}`,
          cancel_url: `${window.location.origin}/check/cost-base-reset`,
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
    <>
      <div className="min-h-screen bg-white font-sans">

        {/* NAV */}
        <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
            <Link href="/" className="font-serif text-lg font-bold text-neutral-950">
              SuperTaxCheck
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-xs font-bold text-red-600">
                  {daysLeft} days to June 30
                </span>
              </div>
              <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">
                ← All tools
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12">

          {/* ── HERO ── */}
          <div className="mb-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-700">
                Div 296 Wealth Eraser · Gate 01
              </span>
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Find out what it costs you<br />
              <span className="text-neutral-400 font-light">to do nothing. Before June 30.</span>
            </h1>

            {/* GEO extraction block */}
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              SMSF trustees have a single, one-time opportunity to reset their cost base before{" "}
              <strong className="text-neutral-950">30 June 2026</strong>. The election is irrevocable and all-or-nothing.
              Miss this date and every dollar of pre-2026 gain is permanently exposed to Division 296 tax.{" "}
              <span className="font-mono text-sm text-neutral-400">
                Source: Division 296 Act s.42, enacted 10 March 2026.
              </span>
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-700">What AI gets wrong about this</p>
              <p className="mt-1 text-sm text-amber-900">
                AI tools say you can select individual assets for the reset.{" "}
                <strong>You cannot.</strong> Every asset resets — including those in a loss position. This calculator applies the enacted March 2026 law.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

            {/* ── LEFT: CALCULATOR + RESULT ── */}
            <div className="space-y-6">

              {/* Calculator */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free calculator</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-neutral-950">
                  Move the sliders to see your exposure
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  No payment required. Your number appears instantly.
                </p>

                <div className="mt-8 space-y-8">
                  <Slider
                    label="Your total super balance"
                    sublabel="Across all super funds"
                    min={3_000_000}
                    max={20_000_000}
                    step={100_000}
                    value={balance}
                    onChange={setBalance}
                    format={(v) => fmt(v)}
                  />
                  <Slider
                    label="Original cost of your main SMSF asset"
                    sublabel="What you paid for it"
                    min={100_000}
                    max={5_000_000}
                    step={50_000}
                    value={costBase}
                    onChange={setCostBase}
                    format={(v) => fmt(v)}
                  />
                  <Slider
                    label="Estimated value at 30 June 2026"
                    sublabel="What it is worth now"
                    min={100_000}
                    max={10_000_000}
                    step={50_000}
                    value={marketValue}
                    onChange={setMarketValue}
                    format={(v) => fmt(v)}
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

              {/* ── RESULT PANEL ── */}
              {hasCalculated && (
                <div ref={resultRef} className={`scroll-mt-24 rounded-2xl border p-6 sm:p-8 ${scoreBg}`}>

                  {/* Score + headline */}
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${calc.score >= 70 ? "border-red-300 bg-red-100" : calc.score >= 40 ? "border-amber-300 bg-amber-100" : "border-blue-300 bg-blue-100"}`}>
                        <span className={`font-serif text-2xl font-bold ${scoreColor}`}>
                          {calc.score}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                        Urgency score
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">Your result</p>
                      <h3 className="mt-1 font-serif text-2xl font-bold text-neutral-950 leading-tight">
                        {calc.score >= 70
                          ? "High exposure. Act before June 30."
                          : calc.score >= 40
                          ? "Meaningful exposure. Modelling recommended."
                          : "Lower exposure. Still worth protecting."}
                      </h3>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-neutral-200 bg-white p-4">
                      <p className="text-xs text-neutral-400">Pre-2026 gain at risk</p>
                      <p className="mt-1 font-serif text-xl font-bold text-neutral-950">{fmt(calc.gain)}</p>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs text-red-600">Your avoidable tax</p>
                      <p className="mt-1 font-serif text-xl font-bold text-red-700">{fmt(calc.saving)}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4">
                      <p className="text-xs text-neutral-400">If you miss June 30</p>
                      <p className="mt-1 font-serif text-xl font-bold text-neutral-950">Lost forever</p>
                    </div>
                  </div>

                  {/* All-or-nothing warning */}
                  <div className="mt-4 rounded-xl border border-amber-200 bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-amber-900">⚠ All-or-nothing election</p>
                    <p className="mt-0.5 text-sm text-amber-800">
                      If your SMSF holds any asset in a loss position at June 30, that cost base also resets lower. This decision needs review before you commit.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 rounded-xl border border-neutral-950 bg-neutral-950 p-5">
                    <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                      {calc.tier === 147
                        ? "Your exposure is significant — you need the full kit"
                        : "Understand the decision before you commit"}
                    </p>
                    <h4 className="mt-2 font-serif text-lg font-bold text-white">
                      {calc.tier === 147
                        ? "Secure your cost-base reset. Before June 30 closes."
                        : "Get the decision logic. Act with confidence."}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      {calc.tier === 147
                        ? `Your estimated avoidable tax is ${fmt(calc.saving)}. The Full Lodgement Kit gives you the Approved Form, Director Minute, and everything to lodge correctly.`
                        : `Your estimated avoidable tax is ${fmt(calc.saving)}. The Decision Logic Pack shows you exactly what to assess, what risks exist, and whether the reset is right for your fund.`}
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100"
                    >
                      {calc.tier === 147
                        ? `Get Full Lodgement Kit — $147 →`
                        : `Get Decision Logic Pack — $67 →`}
                    </button>
                    <p className="mt-2 text-xs text-neutral-500">
                      One-time payment · ${calc.tier} AUD · No subscription
                    </p>
                  </div>

                  {/* Email save */}
                  <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <p className="text-xs text-neutral-500 mb-2">
                      Save this result and get a June 30 reminder:
                    </p>
                    {!emailSaved ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                        />
                        <button
                          onClick={handleSaveEmail}
                          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                        >
                          Save →
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-emerald-700">
                        ✓ Saved. We will remind you before June 30.
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="mt-3 text-sm text-red-700">{error}</p>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT: SIDEBAR ── */}
            <div className="space-y-5">

              {/* Deadline */}
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-red-600">
                  June 30 valuation date
                </p>
                <p className="mt-2 font-serif text-5xl font-bold text-red-700">{daysLeft}</p>
                <p className="font-mono text-xs text-red-600">days remaining</p>
                <p className="mt-2 text-xs leading-relaxed text-red-700">
                  Assets must be independently valued on this exact date. Missing it permanently extinguishes the right.
                </p>
              </div>

              {/* What you get */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
                  What is included
                </p>
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-bold text-neutral-700">$67</span>
                    <span className="text-sm font-semibold text-neutral-900">Prepare — Decision Logic</span>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-600">
                    {["Reset vs. no-reset decision model", "Your personalised tax saving", "All-or-nothing risk assessment", "Director Minute template", "June 30 valuation checklist", "Loss-position asset guide"].map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-neutral-100 pt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">$147</span>
                    <span className="text-sm font-semibold text-neutral-900">Execute — Full Lodgement</span>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-600">
                    {["Everything in $67 pack", "ATO Approved Form Template", "Trustee resolution document", "Asset valuation record template", "Accountant briefing document", "Lodgement timing guide", "Two-cost-base record system"].map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-blue-500">✓</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Law citation */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-3">
                  Legislative basis
                </p>
                <div className="space-y-1 text-sm text-blue-900">
                  <p><strong>Division 296 Act s.42</strong></p>
                  <p>Enacted: 10 March 2026</p>
                  <p>Commencement: 1 July 2026</p>
                  <p>Valuation date: 30 June 2026</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Disclaimer
                </p>
                <p className="text-xs leading-relaxed text-neutral-500">
                  Decision-support tool based on Division 296 Act s.42 enacted 10 March 2026. Not financial, legal, or tax advice. The election is irrevocable. Engage a qualified SMSF specialist before lodging.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* MODAL */}
        {showModal && (
          <PersonaliseModal
            tier={calc.tier}
            answers={answers}
            setAnswers={setAnswers}
            onContinue={handleContinueToPayment}
            onClose={() => setShowModal(false)}
            loading={checkoutLoading}
          />
        )}
      </div>
    </>
  );
}
