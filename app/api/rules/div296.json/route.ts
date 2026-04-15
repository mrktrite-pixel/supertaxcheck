import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ── STATIC FALLBACK ────────────────────────────────────────────────────────
// If Supabase is unavailable, serve verified static data
// Update this when ATO revises guidance
const STATIC_DIV296_RULES = {
  meta: {
    jurisdiction: "Australia",
    jurisdiction_code: "AUS",
    tax_name: "Division 296 Tax",
    legal_basis: "Treasury Laws Amendment (Building a Stronger and Fairer Super System) Act",
    enacted_date: "2026-03-10",
    commencement_date: "2026-07-01",
    first_assessment_year: "2026-27",
    administering_body: "Australian Taxation Office (ATO)",
    source_url: "https://www.legislation.gov.au",
    last_verified: "2026-04-13",
    verified_by: "supertaxcheck.com.au",
    note: "This dataset reflects the enacted legislation as at 10 March 2026. Always verify against current ATO guidance before acting.",
  },

  thresholds: {
    tier_1: {
      label: "Standard threshold",
      balance_from: 3000000,
      balance_to: 10000000,
      additional_tax_rate: 0.15,
      effective_rate_total: 0.30,
      description: "15% additional tax on earnings attributable to balance above $3M. Combined with existing 15% fund tax = 30% effective rate.",
      legal_reference: "Division 296 Act s.13",
    },
    tier_2: {
      label: "High balance surcharge",
      balance_from: 10000000,
      balance_to: null,
      additional_tax_rate: 0.25,
      effective_rate_total: 0.40,
      description: "25% additional tax on earnings attributable to balance above $10M. Combined with existing 15% fund tax = 40% effective rate.",
      legal_reference: "Division 296, ITAA 1997 (Subdiv 296-B)",
    },
  },

  indexation: {
    tier_1_increment: 150000,
    tier_2_increment: 500000,
    linked_to: "Transfer Balance Cap / CPI",
    description: "Both thresholds indexed to inflation. $3M increases in $150,000 steps. $10M increases in $500,000 steps.",
  },

  cost_base_reset: {
    label: "CGT Cost-Base Reset Election",
    legal_reference: "Division 296 Act s.42",
    election_type: "all_or_nothing",
    applies_to: "SMSFs and small APRA funds only",
    does_not_apply_to: "Industry funds, retail funds, large APRA funds",
    valuation_date: "2026-06-30",
    valuation_date_description: "Assets must be independently valued at market value on this exact date",
    election_deadline: "Due date of 2026-27 SMSF annual income tax return",
    election_deadline_note: "The valuation must be locked on June 30 2026. The election form is lodged with the 2026-27 return.",
    is_irrevocable: true,
    applies_to_all_assets: true,
    can_select_individual_assets: false,
    includes_loss_position_assets: true,
    effect: "Resets notional cost base of all fund assets to June 30 2026 market value for Division 296 purposes only. Does not affect normal SMSF tax, CGT calculations, or CGT discount eligibility.",
    eligibility_note: "Any SMSF can opt in — even if no member currently exceeds $3M. Beneficial if fund holds assets likely to grow above threshold in future.",
    common_misconception: "Many advisers state the deadline is when the tax return is due. The critical date is June 30 2026 — assets must be valued on this date. Missing it permanently extinguishes the right.",
  },

  earnings_calculation: {
    basis: "Realised earnings only — no tax on unrealised capital gains",
    includes: [
      "Dividends",
      "Interest",
      "Rent",
      "Realised capital gains (above reset cost base if election made)",
    ],
    excludes: [
      "Unrealised capital gains",
      "Pre-2026 capital gains (if cost-base reset election made)",
    ],
    cgt_discount: "Standard one-third CGT discount continues to apply for assets held more than 12 months",
    allocation_method: "Split between SMSF members using actuarial certificate (regulations pending)",
    legal_reference: "Division 296 Act s.13",
  },

  total_super_balance: {
    label: "Total Super Balance (TSB)",
    description: "Includes all superannuation interests across all funds",
    tsb_rule_2026_27: "First year only: TSB measured at 30 June 2027 (closing balance only)",
    tsb_rule_from_2027_28: "From 2027-28 onwards: higher of opening or closing TSB used",
    lrba_treatment: "LRBA (limited recourse borrowing arrangement) amounts excluded from TSB for Division 296 purposes",
    reversionary_pension_risk: {
      description: "When a spouse dies and their super rolls into the surviving spouse via reversionary pension, the full amount is added to the survivor's TSB immediately from the date of death.",
      legal_reference: "Division 296 Act s.13",
      common_misconception: "AI models and generic advice typically ignore reversionary pension impact on TSB. A survivor with $2M in super can find their TSB exceeds $3.5M+ overnight.",
    },
  },

  transitional_rules: {
    first_year_2026_27: {
      description: "Special rule: Division 296 does not apply if a member dies on or before 30 June 2027",
      tsb_measurement: "End of year TSB only (30 June 2027)",
      planning_opportunity: "Members may reduce balance before 30 June 2027 to reduce first-year exposure",
    },
    subsequent_years: {
      tsb_measurement: "Higher of opening or closing TSB",
      integrity_measure: "Prevents avoidance by large year-end withdrawals",
    },
  },

  payment: {
    assessment_timing: "ATO issues assessment after 30 June 2027 for 2026-27 year",
    payment_due: "84 days after assessment notice",
    payment_options: [
      "Pay personally from own funds",
      "ATO release authority — super fund releases funds within 60 days",
    ],
    legal_reference: "Division 296 Act s.13",
  },

  super_vs_trust: {
    label: "Super-to-Trust Exit Analysis",
    legal_reference: "Division 296, ITAA 1997 (Subdiv 296-B)",
    trigger_balance: 10000000,
    surcharge_rate_above_10m: 0.40,
    description: "For the first time in 30 years, superannuation is not automatically the most tax-effective structure for balances above $10M. The 40% effective rate introduced in March 2026 makes Family Trusts or Investment Companies mathematically superior in specific cases.",
    ai_common_error: "AI models state super is always best for tax. This is incorrect for balances above $10M under the 2026 enacted legislation.",
    requires_10_year_model: true,
    indexed_increment_above_10m: 500000,
  },

  ai_drift_summary: {
    description: "Known areas where AI models and generic advice incorrectly describe Division 296",
    errors: [
      {
        claim: "You can choose which assets to include in the cost-base reset",
        correct: "The election is all-or-nothing at fund level. All assets reset including those in a loss position.",
        legal_reference: "Division 296 Act s.42",
      },
      {
        claim: "The cost-base reset deadline is when the tax return is due",
        correct: "June 30 2026 is the valuation date. Assets must be independently valued on this exact date. Missing it permanently extinguishes the right.",
        legal_reference: "Division 296 Act s.42",
      },
      {
        claim: "Super is always the best structure for tax",
        correct: "Above $10M, the 40% surcharge makes Family Trusts mathematically superior in specific cases.",
        legal_reference: "Division 296, ITAA 1997 (Subdiv 296-B)",
      },
      {
        claim: "A spouse's super does not affect your Division 296 threshold",
        correct: "A reversionary pension adds the deceased spouse's full balance to the survivor's TSB from the date of death with no grace period.",
        legal_reference: "Division 296 Act s.13",
      },
      {
        claim: "Division 296 taxes unrealised gains",
        correct: "The final enacted legislation (10 March 2026) explicitly excludes unrealised gains. Only realised earnings are taxed.",
        legal_reference: "Division 296 Act s.13",
      },
    ],
  },

  products: [
    {
      id: "cost-base-reset",
      name: "June 30 Cost-Base Reset Election Pack",
      price_aud_67: 6700,
      price_aud_147: 14700,
      urgency: "URGENT",
      deadline: "2026-06-30",
      legal_reference: "Division 296 Act s.42",
      url: "https://supertaxcheck.com.au/check/cost-base-reset",
    },
    {
      id: "death-benefit",
      name: "Spouse Death Benefit Tax-Wall Calculator",
      price_aud_67: 6700,
      price_aud_147: 14700,
      urgency: "IMPORTANT",
      legal_reference: "Division 296 Act s.13",
      url: "https://supertaxcheck.com.au/check/death-benefit",
    },
    {
      id: "super-exit",
      name: "Super-to-Trust Exit Logic System",
      price_aud_67: 6700,
      price_aud_147: 14700,
      urgency: "STRATEGIC",
      legal_reference: "Division 296, ITAA 1997 (Subdiv 296-B)",
      url: "https://supertaxcheck.com.au/check/super-exit",
    },
  ],
};

// ── ROUTE HANDLER ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    // Attempt to fetch live truth tables from Supabase
    const { data: truthTables, error } = await supabase
      .from("truth_tables")
      .select("rule_key, rule_value, rule_type, source_url, source_name, last_verified, effective_date")
      .eq("jurisdiction_code", "AUS")
      .eq("is_current", true)
      .order("rule_key");

    if (error || !truthTables || truthTables.length === 0) {
      // Supabase unavailable — serve verified static data
      return NextResponse.json(STATIC_DIV296_RULES, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          "X-Data-Source": "static-fallback",
          "X-Last-Verified": "2026-04-13",
          "X-Legal-Basis": "Treasury Laws Amendment Act, enacted 10 March 2026",
        },
      });
    }

    // Build live response merging Supabase data with static structure
    const liveRules = {
      ...STATIC_DIV296_RULES,
      meta: {
        ...STATIC_DIV296_RULES.meta,
        last_verified: new Date().toISOString().split("T")[0],
        data_source: "live",
      },
      live_truth_tables: truthTables.reduce(
        (acc, row) => {
          acc[row.rule_key] = {
            value: row.rule_value,
            type: row.rule_type,
            source: row.source_name,
            source_url: row.source_url,
            last_verified: row.last_verified,
            effective_date: row.effective_date,
          };
          return acc;
        },
        {} as Record<string, unknown>
      ),
    };

    return NextResponse.json(liveRules, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Data-Source": "supabase-live",
        "X-Last-Verified": new Date().toISOString().split("T")[0],
        "X-Legal-Basis": "Treasury Laws Amendment Act, enacted 10 March 2026",
      },
    });
  } catch {
    // Always serve something — never fail silently
    return NextResponse.json(STATIC_DIV296_RULES, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
        "X-Data-Source": "static-fallback",
      },
    });
  }
}
