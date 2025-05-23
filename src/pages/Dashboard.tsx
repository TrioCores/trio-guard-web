
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServers, fetchBotSettings, updateBotSettings } from '@/lib/server';

// Dashboard components
import AuthTemplate from '../components/dashboard/AuthTemplate';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ServerList from '../components/dashboard/ServerList';
import SettingsNav from '../components/dashboard/SettingsNav';
import EmptyServerState from '../components/dashboard/EmptyServerState';
import ServerSettings from '../components/dashboard/ServerSettings';
import RoleManagement from '../components/dashboard/settings/RoleManagement';
import LoggingSettings from '../components/dashboard/settings/LoggingSettings';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [activeSettingTab, setActiveSettingTab] = useState<string>('general');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check auth on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setSelectedGuild(null);
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An error occurred while logging out",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-trioguard-bg">
        <div className="text-center">
          <div className="animate-pulse-soft inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-4">
            <div className="w-8 h-8 text-trioguard">Loading...</div>
          </div>
          <h2 className="text-xl font-medium text-trioguard-dark">Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  // If not authenticated, show the login screen
  if (!isAuthenticated) {
    return <AuthTemplate onLogin={handleLogin} />;
  }

  // Get the currently selected guild
  const currentGuild = selectedGuild 
    ? guilds.find(guild => guild.id === selectedGuild) 
    : null;

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-6">
            <ServerList 
              guilds={guilds} 
              selectedGuild={selectedGuild}
              setSelectedGuild={setSelectedGuild}
              isLoading={isLoadingServers}
            />
          </div>

          {selectedGuild && (
            <SettingsNav 
              activeTab={activeSettingTab}
              setActiveTab={setActiveSettingTab}
            />
          )}
        </aside>

        {/* Main content */}
        <div className="flex-grow">
          {isLoadingSettings && selectedGuild ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="animate-pulse-soft inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-4">
                <div className="w-8 h-8 text-trioguard">Loading...</div>
              </div>
              <h2 className="text-xl font-medium text-trioguard-dark">Loading settings...</h2>
            </div>
          ) : selectedGuild && currentGuild && settings ? (
            <>
              {activeSettingTab === 'general' && (
                <ServerSettings 
                  guild={currentGuild}
                  settings={settings}
                  onUpdate={handleSettingsUpdate}
                />
              )}
              {activeSettingTab === 'roles' && (
                <RoleManagement 
                  serverId={selectedGuild}
                />
              )}
              {activeSettingTab === 'logging' && (
                <LoggingSettings 
                  serverId={selectedGuild}
                  logChannel={settings.log_channel}
                  onUpdate={handleSettingsUpdate}
                />
              )}
            </>
          ) : (
            <EmptyServerState botInviteLink="https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&integration_type=0&scope=bot+applications.commands" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
