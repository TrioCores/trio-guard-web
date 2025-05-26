
import { supabase } from "@/integrations/supabase/client";

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

// Function to sync Discord servers to database
async function syncDiscordServers(accessToken: string, userId: string) {
  try {
    console.log('Fetching Discord guilds with access token...');
    
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Discord API error:', response.status, await response.text());
      return false;
    }

    const guilds = await response.json();
    console.log('Discord guilds fetched:', guilds);

    // Filter guilds where user is owner (permission & 0x8 means admin, but we want owner)
    const ownedGuilds = guilds.filter((guild: any) => guild.owner === true);
    console.log('Owned guilds:', ownedGuilds);

    // Sync owned guilds to database
    for (const guild of ownedGuilds) {
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
      }
    }

    return true;
  } catch (error) {
    console.error('Error syncing Discord servers:', error);
    return false;
  }
}

export async function fetchOwnedServersForUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No user session found');
      return [];
    }

    const userId = session.user.id;
    console.log('Current user ID:', userId);
    console.log('Session details:', session);

    // Check if we have a Discord access token
    const accessToken = session.provider_token;
    
    if (accessToken) {
      console.log('Discord access token found, syncing servers...');
      const syncSuccess = await syncDiscordServers(accessToken, userId);
      
      if (!syncSuccess) {
        console.warn('Failed to sync Discord servers, using database only');
      }
    } else {
      console.warn('No Discord access token found in session');
    }

    // Fetch servers from database
    console.log('Fetching servers from database...');
    const { data: servers, error } = await supabase
      .from('servers')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching servers from database:', error);
      return [];
    }

    console.log('Final servers list:', servers);
    return servers || [];

  } catch (error) {
    console.error('Exception in fetchOwnedServersForUser:', error);
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
