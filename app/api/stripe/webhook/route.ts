import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
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

      // Update the decision session in Supabase to mark as paid
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
      // Connect to VIDA here:
      // Send email with download links + personalised documents
      // Based on tier (67 = 6 files, 147 = 10 files)
      // And questionnaire answers from decision_sessions record
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
