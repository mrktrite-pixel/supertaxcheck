"use client";

import { useState } from "react";
import Link from "next/link";

export default function SuperToTrustExitPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "super_exit_waitlist" }),
    }).catch(() => {});
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="font-serif text-lg font-bold text-neutral-950">SuperTaxCheck</Link>
          <Link href="/" className="font-mono text-xs text-neutral-400 hover:text-neutral-700 transition">← All tools</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16 text-center space-y-8">

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-blue-700">Gate 03 · Strategic</span>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">
            Super-to-Trust Exit Logic System
          </p>
          <h1 className="font-serif text-4xl font-bold text-neutral-950 sm:text-5xl">
            Super-to-Trust Exit Logic
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 max-w-xl mx-auto">
            For the first time in 30 years, superannuation is not automatically the best structure above $10M. The 40% effective rate introduced in March 2026 makes Family Trusts mathematically superior in specific cases. We run the 10-year model.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-blue-700 mb-2">Building now</p>
          <h2 className="font-serif text-2xl font-bold text-neutral-950">
            This calculator is in development.
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Enter your email to be notified the moment it launches. The Super-to-Trust Exit Logic System will run a 10-year comparative model between superannuation and Family Trust structures — personalised to your balance, growth rate, and tax position.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
              />
              <button type="submit" className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 whitespace-nowrap">
                Notify me →
              </button>
            </form>
          ) : (
            <p className="mt-6 text-sm font-semibold text-emerald-700">
              ✓ We will notify you the moment this launches.
            </p>
          )}
          <p className="mt-3 text-[11px] text-neutral-400">No spam. One notification. When it launches.</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-left">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Legal basis</p>
          <p className="text-sm text-neutral-700">Division 296 Act s.67 · Enacted 10 March 2026</p>
          <p className="mt-2 text-xs text-neutral-500">
            The 40% surcharge above $10M makes trusts superior to superannuation in specific cases. This is the first time in 30 years this calculation has changed. Most AI models still state super is always best for tax — which is incorrect under the enacted 2026 legislation.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-950 transition">
          ← Back to all tools
        </Link>
      </main>
    </div>
  );
}
