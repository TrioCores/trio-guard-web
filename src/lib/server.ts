import { supabase, getCurrentSession, getValidDiscordToken, forceDiscordReauth  } from "@/integrations/supabase/client";

export async function fetchServers() {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    if (!userId) {
      console.log('No user session found');
      return [];
    }

    console.log('Fetching servers for user:', userId);
    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching servers:', error);
      return [];
    }

    console.log('Servers fetched from database:', data);
    return data || [];
  } catch (error) {
    console.error('Exception while fetching servers:', error);
    return [];
  }
}

export async function addServer(name: string, icon: string, id: string, ownerId: string) {
  const { data, error } = await supabase
    .from('servers')
    .insert([{ 
      name, 
      icon, 
      id, 
      owner_id: ownerId 
    }])
    .select();

  if (error) {
    console.error('Error adding server:', error);
    return null;
  }

  // Add server member entry to link the current user to this server
  const { error: memberError } = await supabase
    .from('server_members')
    .insert([{ 
      server_id: id,
      user_id: (await supabase.auth.getSession()).data.session?.user.id,
      role: 'admin'
    }]);

  if (memberError) {
    console.error('Error adding server member:', memberError);
  }

  // Initialize bot settings for this server
  const { error: settingsError } = await supabase
    .from('bot_settings')
    .insert([{ server_id: id }]);

  if (settingsError) {
    console.error('Error initializing bot settings:', settingsError);
  }

  return data?.[0] || null;
}

export async function fetchBotSettings(serverId: string) {
  const { data, error } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('server_id', serverId)
    .single();

  if (error) {
    console.error('Error fetching bot settings:', error);
    return null;
  }

  return data;
}

export async function updateBotSettings(serverId: string, settings: any) {
  const { data, error } = await supabase
    .from('bot_settings')
    .update(settings)
    .eq('server_id', serverId)
    .select();

  if (error) {
    console.error('Error updating bot settings:', error);
    return null;
  }

  return data?.[0] || null;
}

// Enhanced Discord API interaction with better error handling
async function fetchDiscordGuilds(accessToken: string) {
  console.log('Attempting to fetch Discord guilds with token...');
  
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Discord API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });

    // Handle specific Discord API errors
    if (response.status === 401) {
      throw new Error('Discord token expired or invalid');
    } else if (response.status === 429) {
      throw new Error('Discord API rate limit exceeded');
    } else if (response.status >= 500) {
      throw new Error('Discord API server error');
    } else {
      throw new Error(`Discord API error: ${response.status}`);
    }
  }

  const guilds = await response.json();
  console.log('Successfully fetched Discord guilds:', guilds.length);
  return guilds;
}

// Function to sync Discord servers to database with enhanced error handling
async function syncDiscordServers(accessToken: string, userId: string) {
  try {
    console.log('Starting Discord server sync for user:', userId);
    
    const guilds = await fetchDiscordGuilds(accessToken);
    console.log('Discord guilds fetched:', guilds.length, 'guilds');

    // Filter guilds where user is owner
    const ownedGuilds = guilds.filter((guild: any) => {
      const isOwner = guild.owner === true;
      console.log(`Guild ${guild.name}: owner=${guild.owner}, permissions=${guild.permissions}`);
      return isOwner;
    });

    console.log('Owned guilds found:', ownedGuilds.length);

    if (ownedGuilds.length === 0) {
      console.warn('No owned guilds found. User may not be owner of any servers.');
      return { success: true, syncedCount: 0, ownedCount: 0 };
    }

    // Sync owned guilds to database
    let syncedCount = 0;
    for (const guild of ownedGuilds) {
      try {
        const iconUrl = guild.icon 
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null;

        console.log(`Syncing guild: ${guild.name} (${guild.id})`);

        const { error } = await supabase
          .from('servers')
          .upsert({
            id: guild.id,
            name: guild.name,
            icon: iconUrl,
            owner_id: userId,
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error(`Error syncing guild ${guild.id}:`, error);
        } else {
          console.log(`Successfully synced guild: ${guild.name}`);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Exception syncing guild ${guild.id}:`, error);
      }
    }

    return { success: true, syncedCount, ownedCount: ownedGuilds.length };
  } catch (error) {
    console.error('Error syncing Discord servers:', error);
    return { success: false, error: error.message };
  }
}

export async function fetchOwnedServersForUser() {
  try {
    const session = await getCurrentSession();
    
    if (!session) {
      console.error('No user session found');
      return [];
    }

    const userId = session.user.id;
    console.log('Current user ID:', userId);

    // Get a valid Discord token (with automatic refresh if needed)
    console.log('Getting valid Discord token...');
    const accessToken = await getValidDiscordToken();
    
    if (!accessToken) {
      console.warn('No valid Discord token available');
      
      // Try to fetch from database as fallback
      const dbServers = await fetchServersFromDatabase(userId);
      if (dbServers.length === 0) {
        throw new Error('Discord token expired and could not be refreshed. Please log out and log back in.');
      }
      return dbServers;
    }

    // Sync servers with Discord API
    console.log('Discord access token available, syncing servers...');
    const syncResult = await syncDiscordServers(accessToken, userId);
    
    if (!syncResult.success) {
      console.warn('Failed to sync Discord servers:', syncResult.error);
      
      // If sync failed due to token issues, try fallback to database
      if (syncResult.error?.includes('token') || syncResult.error?.includes('401')) {
        console.log('Sync failed due to token issue, falling back to database');
        const dbServers = await fetchServersFromDatabase(userId);
        if (dbServers.length === 0) {
          throw new Error('Unable to sync Discord servers and no servers found in database. Please log out and log back in.');
        }
        return dbServers;
      } else {
        // For other errors, still try to return database servers
        const dbServers = await fetchServersFromDatabase(userId);
        return dbServers;
      }
    } else {
      console.log(`Successfully synced ${syncResult.syncedCount}/${syncResult.ownedCount} owned servers`);
    }

    // Always fetch from database as final step
    return await fetchServersFromDatabase(userId);

  } catch (error) {
    console.error('Exception in fetchOwnedServersForUser:', error);
    
    // Re-throw authentication errors so they can be handled properly by the UI
    if (error.message?.includes('authentication') || 
        error.message?.includes('token') || 
        error.message?.includes('log out and log back in')) {
      throw error;
    }
    
    return [];
  }
}

// Helper function to fetch servers from database
async function fetchServersFromDatabase(userId: string) {
  try {
    console.log('Fetching servers from database for user:', userId);
    const { data: servers, error } = await supabase
      .from('servers')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching servers from database:', error);
      return [];
    }

    console.log('Servers fetched from database:', servers?.length || 0, 'servers');
    return servers || [];
  } catch (error) {
    console.error('Exception fetching servers from database:', error);
    return [];
  }
}

// Function to manually add a server (for testing purposes)
export async function addTestServer() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No user session');
      return null;
    }

    const testServer = {
      id: 'test-server-' + Date.now(),
      name: 'Test Server',
      icon: null,
      owner_id: session.user.id,
    };

    const { data, error } = await supabase
      .from('servers')
      .insert([testServer])
      .select()
      .single();

    if (error) {
      console.error('Error adding test server:', error);
      return null;
    }

    console.log('Test server added:', data);
    return data;
  } catch (error) {
    console.error('Exception adding test server:', error);
    return null;
  }
}

// Function to check Discord OAuth status
export async function checkDiscordOAuthStatus() {
  try {
    const session = await getCurrentSession();
    
    if (!session) {
      return { status: 'no_session', message: 'User not logged in' };
    }

    if (session.user?.app_metadata?.provider !== 'discord') {
      return { status: 'wrong_provider', message: 'User not logged in with Discord' };
    }

    const validToken = await getValidDiscordToken();
    if (!validToken) {
      return { status: 'no_token', message: 'Discord token expired - please log out and log back in' };
    }

    return { status: 'valid', message: 'Discord OAuth is properly configured' };
  } catch (error) {
    console.error('Error checking Discord OAuth status:', error);
    return { status: 'error', message: error.message };
  }
}

// Function to trigger Discord re-authentication
export async function triggerDiscordReauth() {
  try {
    return await forceDiscordReauth();
  } catch (error) {
    console.error('Error triggering Discord re-auth:', error);
    return false;
  }
}
