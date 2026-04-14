import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── POST — capture a lead from homepage email forms ────────────────────────
// Called from AGENT_INJECTION_POINT on homepage
// Phase 1: simple email + balance capture
// Phase 2: CitationGap agent reads this data and sends personalised summary

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      balance,           // raw balance input (string)
      balance_tier,      // 'under3' | '3to5' | '5to10' | 'over10'
      source,            // 'homepage_hero' | 'homepage_agent' | 'homepage_under3'
      jurisdiction_code = "AUS",
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get site_id
    const { data: site } = await supabaseAdmin
      .from("sites")
      .select("id")
      .eq("name", "supertaxcheck")
      .single();

    // Upsert lead — if email exists, update last_seen and balance
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .upsert({
        site_id: site?.id ?? null,
        email,
        jurisdiction_code,
        calc_inputs: {
          balance: balance ?? null,
          balance_tier: balance_tier ?? null,
          source: source ?? "homepage",
          captured_at: new Date().toISOString(),
        },
        converted: false,
        last_seen_at: new Date().toISOString(),
      }, {
        onConflict: "email",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to capture lead:", error);
      return NextResponse.json(
        { error: "Failed to capture lead" },
        { status: 500 }
      );
    }

    // AGENT_INJECTION_POINT
    // Phase 2: trigger CitationGap agent here
    // Agent sends personalised Div 296 risk summary via Resend
    // Agent context: balance, balance_tier, days_to_june30, source
    // For now: lead is stored, Resend sequence triggered manually

    return NextResponse.json({
      success: true,
      id: lead?.id ?? null,
    });

  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    );
  }
}
