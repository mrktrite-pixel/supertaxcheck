import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface CreateSessionBody {
  // Which product page
  product_slug: string;        // 'cost-base-reset' | 'death-benefit' | 'super-exit'
  source_path: string;         // '/check/cost-base-reset'

  // Their inputs
  inputs: Record<string, unknown>;        // all calculator inputs as JSON
  estimated_exposure?: number;            // dollar amount at risk (cents)
  balance_tier?: string;                  // 'under3' | '3to5' | '5to10' | 'over10'

  // Their result
  output?: Record<string, unknown>;       // calculator output as JSON
  score?: number;                         // 0-100 viability/risk score
  score_status?: string;                  // 'high_risk' | 'medium_risk' | 'low_risk'
  recommended_tier?: number;             // 67 or 147

  // Optional email capture
  email?: string;
}

interface UpdateSessionBody {
  id: string;
  // Payment intent
  tier_intended?: number;                 // 67 or 147
  product_key?: string;                   // 'supertax_67_cost_base_reset' etc

  // Personalise questions answered
  personalise_answers?: Record<string, unknown>;

  // Post-payment
  stripe_session_id?: string;
  converted?: boolean;
  email?: string;
}

// ── GET — retrieve a session ───────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const stripeSessionId = searchParams.get("stripe_session_id");

    if (!id && !stripeSessionId) {
      return NextResponse.json(
        { error: "Provide id or stripe_session_id" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from("decision_sessions")
      .select("*");

    if (id) {
      query = query.eq("id", id);
    } else if (stripeSessionId) {
      query = query.eq("inputs->stripe_session_id", stripeSessionId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/decision-sessions error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}

// ── POST — create a new session ────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: CreateSessionBody = await request.json();

    const {
      product_slug,
      source_path,
      inputs,
      estimated_exposure,
      balance_tier,
      output,
      score,
      score_status,
      recommended_tier,
      email,
    } = body;

    // Validate required fields
    if (!product_slug || !source_path || !inputs) {
      return NextResponse.json(
        { error: "product_slug, source_path and inputs are required" },
        { status: 400 }
      );
    }

    // Get the site_id for supertaxcheck
    const { data: site } = await supabaseAdmin
      .from("sites")
      .select("id")
      .eq("name", "supertaxcheck")
      .single();

    // Get the product_id
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", product_slug)
      .single();

    // Build session payload
    const sessionPayload = {
      site_id: site?.id ?? null,
      product_id: product?.id ?? null,
      session_id: crypto.randomUUID(),
      inputs: {
        ...inputs,
        source_path,
        balance_tier: balance_tier ?? null,
        email: email ?? null,
      },
      output: output ?? null,
      completed: true,
      converted: false,
      created_at: new Date().toISOString(),
    };

    const { data: session, error } = await supabaseAdmin
      .from("decision_sessions")
      .insert(sessionPayload)
      .select()
      .single();

    if (error || !session) {
      console.error("Failed to create decision session:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // If email provided — also create/update lead
    if (email) {
      await supabaseAdmin
        .from("leads")
        .upsert({
          site_id: site?.id ?? null,
          email,
          jurisdiction_code: "AUS",
          source_product_id: product?.id ?? null,
          calc_inputs: inputs,
          calc_output: output ?? null,
          estimated_exposure: estimated_exposure ?? null,
          converted: false,
          last_seen_at: new Date().toISOString(),
        }, {
          onConflict: "email",
          ignoreDuplicates: false,
        });
    }

    return NextResponse.json({
      id: session.id,
      session_id: session.session_id,
      created_at: session.created_at,
    });

  } catch (err) {
    console.error("POST /api/decision-sessions error:", err);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// ── PATCH — update existing session ───────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateSessionBody = await request.json();

    const {
      id,
      tier_intended,
      product_key,
      personalise_answers,
      stripe_session_id,
      converted,
      email,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Session id is required" },
        { status: 400 }
      );
    }

    // Get existing session
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("decision_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Merge updates into inputs
    const updatedInputs = {
      ...existing.inputs,
      ...(tier_intended !== undefined && { tier_intended }),
      ...(product_key && { product_key }),
      ...(personalise_answers && { personalise_answers }),
      ...(stripe_session_id && { stripe_session_id }),
      ...(email && { email }),
    };

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("decision_sessions")
      .update({
        inputs: updatedInputs,
        converted: converted ?? existing.converted,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { error: "Failed to update session" },
        { status: 500 }
      );
    }

    // If email + conversion — update lead
    if (email && converted) {
      await supabaseAdmin
        .from("leads")
        .update({
          converted: true,
          last_seen_at: new Date().toISOString(),
        })
        .eq("email", email);

      // Record purchase attempt
      if (stripe_session_id && tier_intended) {
        const { data: site } = await supabaseAdmin
          .from("sites")
          .select("id")
          .eq("name", "supertaxcheck")
          .single();

        await supabaseAdmin
          .from("purchases")
          .insert({
            site_id: site?.id ?? null,
            stripe_session_id,
            amount_paid: tier_intended === 67 ? 6700 : 14700,
            currency: "AUD",
            status: "pending",
          });
      }
    }

    return NextResponse.json({
      id: updated.id,
      updated: true,
    });

  } catch (err) {
    console.error("PATCH /api/decision-sessions error:", err);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
