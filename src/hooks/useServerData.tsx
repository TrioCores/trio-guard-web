
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  fetchOwnedServersForUser,
  fetchBotSettings,
  updateBotSettings,
  checkDiscordOAuthStatus,
} from "@/lib/server";

export const useServerData = (isAuthenticated: boolean) => {
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [activeSettingTab, setActiveSettingTab] = useState<string>("general");
  const [discordStatus, setDiscordStatus] = useState<string>('checking');
  const queryClient = useQueryClient();

  // Check Discord OAuth status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkDiscordOAuthStatus().then((status) => {
        setDiscordStatus(status.status);
        console.log('Discord OAuth status:', status);
        
        if (status.status !== 'valid') {
          console.warn('Discord OAuth issue:', status.message);
        }
      });
    }
  }, [isAuthenticated]);

  // Add effect to log authentication status
  useEffect(() => {
    console.log('useServerData - Authentication status:', isAuthenticated);
  }, [isAuthenticated]);

  // Fetch owned servers for the current user
  const { data: guilds = [], isLoading: isLoadingServers, error: serverError, refetch: refetchServers } = useQuery<any[]>({
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
        
        if (servers.length === 0 && discordStatus === 'valid') {
          toast({
            title: "No servers found",
            description: "Make sure you own Discord servers with the bot invited",
            variant: "destructive",
          });
        }
        
        return servers;
      } catch (error) {
        console.error('Error in server fetch query:', error);
        
        // Show specific error messages based on the type of error
        let errorMessage = "There was an error loading your Discord servers";
        let errorTitle = "Error fetching servers";
        
        if (error.message?.includes('authentication') || error.message?.includes('token')) {
          errorTitle = "Discord Authentication Required";
          errorMessage = error.message;
          
          // Update Discord status to reflect the authentication issue
          setDiscordStatus('no_token');
        } else if (error.message?.includes('rate limit')) {
          errorMessage = "Discord API rate limit reached. Please try again in a few minutes.";
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
          action: error.message?.includes('authentication') ? {
            altText: "Log out and log back in",
            onClick: () => {
              // This would trigger a logout - you could implement this
              window.location.href = '/';
            }
          } : undefined
        });
        
        return [];
      }
    },
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('token') || error?.message?.includes('401') || error?.message?.includes('authentication')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    discordStatus,
    refetchServers,
    currentGuild: selectedGuild
      ? guilds.find((guild: any) => guild.id === selectedGuild)
      : null,
  };
};
