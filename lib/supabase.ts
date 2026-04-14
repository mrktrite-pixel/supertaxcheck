import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper: fetch truth table value by rule_key
export async function getTruthValue(ruleKey: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('truth_tables')
    .select('rule_value')
    .eq('rule_key', ruleKey)
    .eq('is_current', true)
    .single()

  if (error || !data) return null
  return data.rule_value
}

// Helper: fetch all rules for a jurisdiction
export async function getJurisdictionRules(
  jurisdictionCode: string
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('truth_tables')
    .select('rule_key, rule_value')
    .eq('jurisdiction_code', jurisdictionCode)
    .eq('is_current', true)

  if (error || !data) return {}

  return data.reduce((acc, row) => {
    acc[row.rule_key] = row.rule_value
    return acc
  }, {} as Record<string, string>)
}