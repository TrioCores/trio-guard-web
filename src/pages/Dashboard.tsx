
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Dashboard components
import AuthTemplate from '../components/dashboard/AuthTemplate';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ServerList from '../components/dashboard/ServerList';
import SettingsNav from '../components/dashboard/SettingsNav';
import EmptyServerState from '../components/dashboard/EmptyServerState';
import ServerSettings from '../components/dashboard/ServerSettings';

// Mock data
const mockGuilds = [
  {
    id: '1234567890123456',
    name: 'Gaming Community',
    icon: 'https://source.unsplash.com/random/100x100?gaming',
    memberCount: 1250,
    botInstalled: true
  },
  {
    id: '2345678901234567',
    name: 'Tech Support',
    icon: 'https://source.unsplash.com/random/100x100?tech',
    memberCount: 845,
    botInstalled: true
  },
  {
    id: '3456789012345678',
    name: 'Art Showcase',
    icon: 'https://source.unsplash.com/random/100x100?art',
    memberCount: 623,
    botInstalled: false
  }
];

const mockSettings = {
  autoMod: true,
  welcomeMessages: true,
  welcomeChannel: 'welcome',
  welcomeMessage: 'Welcome to the server, {user}! Please read our rules in #rules.',
  logChannel: 'mod-logs',
  enableWarnings: true,
  maxWarnings: 3,
  muteRole: 'Muted',
  moderationRoles: ['Admin', 'Moderator'],
  commandPrefix: '-',
  customCommands: [
    { name: 'serverinfo', response: 'This server was created on {server.creationDate}.' },
    { name: 'ping', response: 'Pong! Bot latency: {bot.ping}ms' }
  ]
};

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [settings, setSettings] = useState(mockSettings);
  const [guilds, setGuilds] = useState(mockGuilds);
  const navigate = useNavigate();

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
            />
          </div>

          {selectedGuild && <SettingsNav />}
        </aside>

        {/* Main content */}
        <div className="flex-grow">
          {selectedGuild && currentGuild ? (
            <ServerSettings 
              guild={currentGuild}
              settings={settings}
              setSettings={setSettings}
            />
          ) : (
            <EmptyServerState />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
