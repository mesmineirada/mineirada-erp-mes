import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigMissing = !supabaseUrl || !supabaseAnonKey;

// The browser receives only the public anon/publishable key. RLS is the security
// boundary; never put a service-role key in a VITE_ variable.
export const supabase = !supabaseConfigMissing
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
