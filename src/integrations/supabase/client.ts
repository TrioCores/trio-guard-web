
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
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null,
    providerToken: !!session.provider_token,
    refreshToken: !!session.provider_refresh_token
  });

  return hasDiscordToken && tokenNotExpired;
};

// Enhanced function to refresh Discord token
export const refreshDiscordToken = async () => {
  try {
    console.log('Attempting to refresh Discord token...');
    
    // First try the standard refresh
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      
      // If refresh fails, the user needs to re-authenticate
      if (error.message?.includes('Invalid refresh token') || error.message?.includes('refresh_token_not_found')) {
        console.warn('Refresh token is invalid - user needs to re-authenticate');
        return false;
      }
      
      return false;
    }

    if (data?.session?.provider_token) {
      console.log('Discord token refreshed successfully');
      return true;
    } else {
      console.warn('Session refreshed but no provider token available');
      return false;
    }
  } catch (error) {
    console.error('Exception refreshing session:', error);
    return false;
  }
};

// Function to force re-authentication with Discord
export const forceDiscordReauth = async () => {
  try {
    console.log('Forcing Discord re-authentication...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        scopes: 'identify guilds',
        redirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) {
      console.error('Error during Discord re-auth:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception during Discord re-auth:', error);
    return false;
  }
};
