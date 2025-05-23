import { supabase } from "@/integrations/supabase/client";


export async function fetchServers() {
  try {
    console.log('Fetching servers...');
    const { data, error } = await supabase.from('servers').select('*');
    
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
