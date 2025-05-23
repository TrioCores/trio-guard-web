import { createClient } from "@supabase/supabase-js";
import type { Database } from "../integrations/supabase/types";

const SUPABASE_URL = "https://knfehntjwoohslohamvk.supabase.co";
const SUPABASE_ANON_KEY = "knfehntjwoohslohamvk"; 

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
