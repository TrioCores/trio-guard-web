
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

// Enhanced function to check if Discord token is actually valid by testing it against Discord API
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

  // If we don't have the basic requirements, return false
  if (!hasDiscordToken || !tokenNotExpired) {
    return false;
  }

  // Test the token against Discord API to see if it's actually valid
  try {
    console.log('Testing Discord token against API...');
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Discord token is valid');
      return true;
    } else {
      console.log('Discord token is invalid or expired:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error testing Discord token:', error);
    return false;
  }
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
      
      // Test the new token against Discord API
      const isValid = await checkDiscordToken();
      if (isValid) {
        console.log('Refreshed Discord token is valid');
        return true;
      } else {
        console.warn('Refreshed Discord token is still invalid');
        return false;
      }
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
