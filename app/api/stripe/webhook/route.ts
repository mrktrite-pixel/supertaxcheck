import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Both Stripe and Supabase initialised inside handler
// Prevents build failures when env variables not yet set in Vercel

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables");
  return createClient(url, key);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const decisionSessionId = session.metadata?.decision_session_id;
      const tier = Number(session.metadata?.tier);
      const productKey = session.metadata?.product_key;
      const countryKey = session.metadata?.country_key;

      console.log("Payment confirmed:", {
        decisionSessionId,
        tier,
        productKey,
        stripeSessionId: session.id,
      });

      if (!decisionSessionId) {
        console.error("Missing decision_session_id in Stripe metadata");
        return NextResponse.json({ received: true });
      }

      const supabase = getSupabase();

      const { error } = await supabase
        .from("decision_sessions")
        .update({
          stripe_checkout_session_id: session.id,
          stripe_payment_status: "paid",
          tier_purchased: tier,
          product_key: productKey ?? undefined,
          country_key: countryKey ?? undefined,
        })
        .eq("id", decisionSessionId);

      if (error) {
        console.error("Supabase update error:", error);
      } else {
        console.log("Decision session marked as paid:", decisionSessionId);
      }

      // AGENT_INJECTION_POINT — Phase 2
      // Connect to VIDA here to send personalised documents
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
