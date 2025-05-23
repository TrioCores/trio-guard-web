import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Custom hooks
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useServerData } from "@/hooks/useServerData";

// Dashboard components
import AuthTemplate from "../components/dashboard/AuthTemplate";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardContent from "../components/dashboard/DashboardContent";
import LoadingScreen from "../components/dashboard/LoadingScreen";

// ✅ Funktion til at validere UUID-format
function validateUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  );
}

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
    currentGuild,
  } = useServerData(isAuthenticated);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrCreateProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        return;
      }

      // ✅ Tjek om user.id er et gyldigt UUID
      if (!validateUUID(user.id)) {
        console.error("Invalid UUID for user.id:", user.id);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                username:
                  user.user_metadata?.full_name || user.email || "Unknown",
                avatar_url: user.user_metadata?.avatar_url || "",
                discord_id: user.user_metadata?.discord_id || "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .single();

          if (insertError) {
            console.error("Error creating profile:", insertError);
            return;
          }
          setProfile(newProfile);
        } else {
          console.error("Error fetching profile:", error);
          return;
        }
      } else {
        setProfile(data);
      }
    };

    fetchOrCreateProfile();
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setSelectedGuild(null);
      setProfile(null);
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

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
        profiles={profile}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
