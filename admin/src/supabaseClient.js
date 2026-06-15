import { createClient } from '@supabase/supabase-js'

// Paste your Supabase URL and anon key here from supabase.com → Settings → API
const SUPABASE_URL = 'https://obnluxtnrmvrsqhoapvl.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = 'sb_publishable_50vYLzuw-EJZEB34bzXfrg_Y5aeGmYi'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)