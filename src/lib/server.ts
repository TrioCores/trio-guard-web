import { supabase } from "@/integrations/supabase/client";


export async function fetchServers() {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    if (!userId) return [];

    console.log('Fetching servers for user:', userId);
    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching servers:', error);
      return [];
    }

    console.log('Servers fetched:', data);
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

async function fetchDiscordOwnedGuilds(accessToken: string) {
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    console.error('Failed to fetch Discord guilds:', await res.text());
    return [];
  }
  const guilds = await res.json();
  return guilds.filter((g: any) => g.owner);
}

async function syncServersToDatabase(ownedGuilds: any[], ownerId: string) {
  for (const guild of ownedGuilds) {
    const { id, name, icon } = guild;

    // Opbyg evt. icon url hvis der er et ikon
    const iconUrl = icon
      ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
      : null;

    // Upsert (insert eller update hvis findes) server i Supabase
    const { error } = await supabase.from('servers').upsert({
      id: id,
      name: name,
      icon: iconUrl,
      owner_id: ownerId,
    }, {
      onConflict: 'id'
    });

    if (error) {
      console.error(`Failed to upsert server ${id}:`, error);
    }
  }
}

export async function fetchOwnedServersForUser() {
  // Hent bruger-session + access_token
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    console.error("User not logged in");
    return [];
  }

  const userId = session.user.id;
  const accessToken = session.provider_token; // Discord OAuth token - tjek om du gemmer det her

  if (!accessToken) {
    console.error("Missing Discord access token");
    return [];
  }

  console.log('Fetching Discord owned guilds...');
  const ownedGuilds = await fetchDiscordOwnedGuilds(accessToken);

  console.log('Syncing owned guilds to Supabase...');
  await syncServersToDatabase(ownedGuilds, userId);

  console.log('Fetching owned servers from Supabase...');
  const { data, error } = await supabase
    .from('servers')
    .select('*')
    .eq('owner_id', userId);

  if (error) {
    console.error('Error fetching servers from Supabase:', error);
    return [];
  }

  return data || [];
}



