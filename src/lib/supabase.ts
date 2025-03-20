import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Use dummy values if environment variables are not set
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.error(
    "Missing Supabase credentials. Using dummy values. Please connect Supabase in the Tempo platform.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
