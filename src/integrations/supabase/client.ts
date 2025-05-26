
// Denne fil genererer Supabase klienten til at bruge i hele appen
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://knfehntjwoohslohamvk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZmVobnRqd29vaHNsb2hhbXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTUxNTcsImV4cCI6MjA2MzQ3MTE1N30.TQfU2iHOjr8Pk1vE8otDgXtEBgbe_F3JP_FAQKHp-TE";

// Supabase klient med session-persistens og automatisk token refresh
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    // Ensure Discord OAuth tokens are properly handled
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
});

// Helper function to check if user has valid Discord OAuth token
export const checkDiscordToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('No session found');
    return false;
  }

  // Check if we have Discord provider token and if it's not expired
  const hasDiscordToken = !!(session.provider_token && session.provider_refresh_token);
  const tokenNotExpired = session.expires_at ? (session.expires_at * 1000) > Date.now() : false;
  
  console.log('Discord token check:', {
    hasToken: hasDiscordToken,
    notExpired: tokenNotExpired,
    provider: session.user?.app_metadata?.provider,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null
  });

  return hasDiscordToken && tokenNotExpired;
};

// Helper function to refresh Discord token if needed
export const refreshDiscordToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      return false;
    }

    console.log('Session refreshed successfully');
    return true;
  } catch (error) {
    console.error('Exception refreshing session:', error);
    return false;
  }
};
