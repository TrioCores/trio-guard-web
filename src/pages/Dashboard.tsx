
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Custom hooks
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useServerData } from '@/hooks/useServerData';

// Dashboard components
import AuthTemplate from '../components/dashboard/AuthTemplate';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardContent from '../components/dashboard/DashboardContent';
import LoadingScreen from '../components/dashboard/LoadingScreen';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, setIsAuthenticated } = useAuthStatus();
  const { 
    guilds,
    settings,
    selectedGuild,
    setSelectedGuild,
    activeSettingTab,
    setActiveSettingTab,
    isLoadingServers,
    isLoadingSettings,
    handleSettingsUpdate,
    currentGuild
  } = useServerData(isAuthenticated);

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
    return <LoadingScreen />;
  }

  // If not authenticated, show the login screen
  if (!isAuthenticated) {
    return <AuthTemplate onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <DashboardContent 
        guilds={guilds}
        selectedGuild={selectedGuild}
        setSelectedGuild={setSelectedGuild}
        activeSettingTab={activeSettingTab}
        setActiveSettingTab={setActiveSettingTab}
        isLoadingServers={isLoadingServers}
        isLoadingSettings={isLoadingSettings}
        settings={settings}
        currentGuild={currentGuild}
        handleSettingsUpdate={handleSettingsUpdate}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
