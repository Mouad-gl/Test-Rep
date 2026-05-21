import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iyzjyxlegljwcbmayhqq.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable__cabdqlzr5FpbfebR4hH3A_ihvkofKg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
