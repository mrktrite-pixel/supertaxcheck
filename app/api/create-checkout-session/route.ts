import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe initialised inside handler — not at module level
// Prevents build failures when env variables are not yet set in Vercel

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY — add to Vercel environment variables");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

function getPriceId(tier: number): string | undefined {
  if (tier === 67) return process.env.STRIPE_DIV296_67;
  if (tier === 147) return process.env.STRIPE_DIV296_147;
  return undefined;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const body = await req.json();

    const { decision_session_id, tier, product_key, success_url, cancel_url } = body;

    console.log("Incoming checkout request:", { decision_session_id, tier, product_key });

    if (!decision_session_id || !tier) {
      return NextResponse.json(
        { error: "Missing required fields: decision_session_id and tier are required." },
        { status: 400 }
      );
    }

    const normalizedTier = Number(tier);

    if (![67, 147].includes(normalizedTier)) {
      return NextResponse.json(
        { error: "Invalid tier. Expected 67 or 147." },
        { status: 400 }
      );
    }

    const priceId = getPriceId(normalizedTier);

    if (!priceId) {
      const envKey = `STRIPE_DIV296_${normalizedTier}`;
      console.error("Missing Stripe price ID for:", envKey);
      return NextResponse.json(
        { error: `Missing Stripe price configuration for ${envKey}. Add to Vercel environment variables.` },
        { status: 500 }
      );
    }

    const productKey = product_key || `supertax_${normalizedTier}_div296_wealth_eraser`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supertaxcheck.com.au";
    const successPath = normalizedTier === 147 ? "execute" : "prepare";

    const resolvedSuccessUrl = success_url
      ? `${success_url}?payment=success&tier=${normalizedTier}&session_id={CHECKOUT_SESSION_ID}`
      : `${baseUrl}/check/div296-wealth-eraser/success/${successPath}?payment=success&tier=${normalizedTier}&session_id={CHECKOUT_SESSION_ID}`;

    const resolvedCancelUrl = cancel_url || `${baseUrl}/check/div296-wealth-eraser`;

    console.log("Creating Stripe session:", { priceId, productKey, successPath });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: resolvedSuccessUrl,
      cancel_url: resolvedCancelUrl,
      metadata: {
        decision_session_id: String(decision_session_id),
        tier: String(normalizedTier),
        product_key: productKey,
        country_key: "div296",
        verification_source: "stripe_checkout",
      },
      payment_intent_data: {
        metadata: {
          decision_session_id: String(decision_session_id),
          tier: String(normalizedTier),
          product_key: productKey,
        },
      },
    });

    console.log("Stripe session created:", session.id);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe session created but no checkout URL returned." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      {
        error: "Failed to create checkout session.",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
