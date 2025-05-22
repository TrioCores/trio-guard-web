// src/lib/servers.ts
import { supabase } from './supabaseClient';

export async function fetchServers() {
  const { data, error } = await supabase.from('servers').select('*');
  if (error) {
    console.error('Error fetching servers:', error);
    return [];
  }
  return data;
}

export async function addServer(name: string, icon: string, memberCount: number) {
  const { data, error } = await supabase
    .from('servers')
    .insert([{ name, icon, memberCount }]);

  if (error) {
    console.error('Error adding server:', error);
    return null;
  }
  return data;
}
