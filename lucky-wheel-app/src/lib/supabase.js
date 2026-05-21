import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vogtmvcgpziqevssqwxa.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_SvtflX932DUZfQM8qjEAzA_Q2QpfFIx'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
