// Supabase client initializer
// Reads env vars and exports a singleton Supabase client.
// Prefers VITE_ prefixed vars (Vite recommended), but falls back to NEXT_PUBLIC_ if present.
// NOTE: Do not use the service_role key in the frontend. For PII-protected operations (respondent creation)
// prefer calling the server `/submit` endpoint which uses the service_role key server-side.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase URL or anon key is missing. Check your .env.local or Vite env variables.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export default supabase
