
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  fetchOwnedServersForUser,
  fetchBotSettings,
  updateBotSettings,
} from "@/lib/server";

export const useServerData = (isAuthenticated: boolean) => {
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [activeSettingTab, setActiveSettingTab] = useState<string>("general");
  const queryClient = useQueryClient();

  // Add effect to log authentication status
  useEffect(() => {
    console.log('useServerData - Authentication status:', isAuthenticated);
  }, [isAuthenticated]);

  // Fetch owned servers for the current user
  const { data: guilds = [], isLoading: isLoadingServers, error: serverError } = useQuery<any[]>({
    queryKey: ["servers"],
    queryFn: async () => {
      console.log('Fetching servers - authentication status:', isAuthenticated);
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping server fetch');
        return [];
      }
      
      try {
        const servers = await fetchOwnedServersForUser();
        console.log('Servers fetched successfully:', servers);
        return servers;
      } catch (error) {
        console.error('Error in server fetch query:', error);
        toast({
          title: "Error fetching servers",
          description: "There was an error loading your Discord servers",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: isAuthenticated,
    retry: 2,
    retryDelay: 1000,
  });

  // Log server fetch results
  useEffect(() => {
    if (serverError) {
      console.error('Server fetch error:', serverError);
    }
    console.log('Current guilds state:', guilds);
  }, [guilds, serverError]);

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["botSettings", selectedGuild],
    queryFn: () => fetchBotSettings(selectedGuild!),
    enabled: !!selectedGuild && isAuthenticated,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ serverId, settings }: { serverId: string; settings: any }) =>
      updateBotSettings(serverId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["botSettings", selectedGuild],
      });
      toast({
        title: "Settings saved",
        description: "Bot settings have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating settings:", error);
    },
  });

  const handleSettingsUpdate = (key: string, value: any) => {
    if (!selectedGuild || !settings) return;

    updateSettingsMutation.mutate({
      serverId: selectedGuild,
      settings: { [key]: value, updated_at: new Date().toISOString() },
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
      : null,
  };
};
