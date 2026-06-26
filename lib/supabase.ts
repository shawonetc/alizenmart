import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : 'https://placeholder-project.supabase.co'

const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseAnonKey = rawAnonKey && rawAnonKey !== 'your_supabase_anon_key' && rawAnonKey !== 'your_supabase_publishable_key'
  ? rawAnonKey 
  : 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

