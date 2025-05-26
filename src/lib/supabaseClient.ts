
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../integrations/supabase/types";

const SUPABASE_URL = "https://knfehntjwoohslohamvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZmVobnRqd29vaHNsb2hhbXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTUxNTcsImV4cCI6MjA2MzQ3MTE1N30.TQfU2iHOjr8Pk1vE8otDgXtEBgbe_F3JP_FAQKHp-TE";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
    },
  }
);
