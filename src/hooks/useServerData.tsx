
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { fetchServers, fetchBotSettings, updateBotSettings } from '@/lib/server';

export const useServerData = (isAuthenticated: boolean) => {
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [activeSettingTab, setActiveSettingTab] = useState<string>('general');
  const queryClient = useQueryClient();

  // Fetch servers using React Query
  const { 
    data: guilds = [], 
    isLoading: isLoadingServers 
  } = useQuery({
    queryKey: ['servers'],
    queryFn: fetchServers,
    enabled: isAuthenticated
  });

  // Fetch settings for the selected server
  const { 
    data: settings,
    isLoading: isLoadingSettings
  } = useQuery({
    queryKey: ['botSettings', selectedGuild],
    queryFn: () => fetchBotSettings(selectedGuild!),
    enabled: !!selectedGuild && isAuthenticated
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: ({ serverId, settings }: { serverId: string, settings: any }) => 
      updateBotSettings(serverId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['botSettings', selectedGuild] });
      toast({
        title: "Settings saved",
        description: "Bot settings have been updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
      console.error('Error updating settings:', error);
    }
  });

  // Handle setting updates
  const handleSettingsUpdate = (key: string, value: any) => {
    if (!selectedGuild || !settings) return;
    
    updateSettingsMutation.mutate({
      serverId: selectedGuild,
      settings: { [key]: value, updated_at: new Date().toISOString() }
    });
  };

  return {
    guilds,
    settings,
    selectedGuild,
    setSelectedGuild,
    activeSettingTab,
    setActiveSettingTab,
    isLoadingServers,
    isLoadingSettings,
    handleSettingsUpdate,
    currentGuild: selectedGuild 
      ? guilds.find((guild: any) => guild.id === selectedGuild) 
      : null
  };
};
