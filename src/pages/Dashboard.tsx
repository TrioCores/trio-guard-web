
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Server, Shield, MessageSquare, Bell, Ban, Activity, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";
import Logo from '../components/Logo';

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [settings, setSettings] = useState(mockSettings);
  const [guilds, setGuilds] = useState(mockGuilds);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Simulate auth check
  useEffect(() => {
    const checkAuth = () => {
      // Mock authentication check
      const auth = localStorage.getItem('discord_auth') || sessionStorage.getItem('discord_auth');
      if (auth) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    // Simulate API delay
    setTimeout(checkAuth, 1000);
  }, []);

  // Mock login function
  const handleLogin = () => {
    // In a real application, this would redirect to Discord OAuth
    toast({
      title: "Redirecting to Discord",
      description: "You would be redirected to Discord's OAuth page",
    });
    
    // Mock successful login after 1.5 seconds
    setTimeout(() => {
      localStorage.setItem('discord_auth', 'mock_token');
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "You're now logged in with Discord",
      });
    }, 1500);
  };

  // Mock logout function
  const handleLogout = () => {
    localStorage.removeItem('discord_auth');
    sessionStorage.removeItem('discord_auth');
    setIsAuthenticated(false);
    setSelectedGuild(null);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  // Mock save settings function
  const saveSettings = async () => {
    toast({
      title: "Saving settings...",
      description: "Your changes are being saved",
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully",
      });
    }, 1000);
  };

  // Handle setting changes
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-trioguard-bg">
        <div className="text-center">
          <div className="animate-pulse-soft inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-4">
            <Shield className="w-8 h-8 text-trioguard" />
          </div>
          <h2 className="text-xl font-medium text-trioguard-dark">Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm py-4">
          <div className="container-custom flex justify-between items-center">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <Logo />
            </div>
            <button onClick={handleLogin} className="btn-primary">
              Login with Discord
            </button>
          </div>
        </header>
        
        <main className="flex-grow flex items-center justify-center bg-trioguard-bg">
          <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-md">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-trioguard mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">TrioGuard Dashboard</h1>
              <p className="text-trioguard-dark/80">
                Log in with your Discord account to manage TrioGuard in your servers.
              </p>
            </div>
            
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center font-medium transition-colors"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
              </svg>
              Login with Discord
            </button>
            
            <div className="mt-6 text-center text-sm text-trioguard-dark/60">
              <p>Don't have TrioGuard in your server yet?</p>
              <a href="/#invite" className="text-trioguard font-medium hover:underline">
                Invite TrioGuard to your server first
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container-custom flex justify-between items-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center text-trioguard-dark hover:text-trioguard transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow bg-trioguard-bg">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <h2 className="font-medium mb-4">Your Servers</h2>
                <div className="space-y-2">
                  {guilds.map(guild => (
                    <div 
                      key={guild.id}
                      onClick={() => setSelectedGuild(guild.id)}
                      className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${
                        selectedGuild === guild.id 
                          ? 'bg-trioguard/10 border border-trioguard/30' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img 
                          src={guild.icon} 
                          alt={guild.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="ml-3 flex-grow overflow-hidden">
                        <p className="font-medium truncate">{guild.name}</p>
                        <p className="text-xs text-trioguard-dark/60 truncate">
                          {guild.memberCount} members
                        </p>
                      </div>
                      {!guild.botInstalled && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Not installed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedGuild && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h2 className="font-medium mb-4">TrioGuard Settings</h2>
                  <nav className="space-y-1">
                    {[
                      { name: 'General', icon: Settings },
                      { name: 'Moderation', icon: Shield },
                      { name: 'Welcome', icon: MessageSquare },
                      { name: 'Notifications', icon: Bell },
                      { name: 'Punishments', icon: Ban },
                      { name: 'Logging', icon: Activity },
                    ].map(item => (
                      <a 
                        key={item.name}
                        href={`#${item.name.toLowerCase()}`}
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <item.icon size={18} className="text-trioguard mr-3" />
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </aside>

            {/* Main content */}
            <div className="flex-grow">
              {selectedGuild ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-2xl font-bold mb-4">
                      {guilds.find(g => g.id === selectedGuild)?.name}
                    </h1>
                    <p className="text-trioguard-dark/80 mb-4">
                      Configure TrioGuard settings for your server.
                    </p>
                    <div className="flex items-center text-sm text-trioguard-dark/60">
                      <Server size={16} className="mr-2" />
                      <span>Server ID: {selectedGuild}</span>
                    </div>
                  </div>

                  {/* Settings Sections */}
                  <div id="general" className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold">General Settings</h2>
                      <p className="text-trioguard-dark/70 text-sm">
                        Basic configuration for TrioGuard
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Command Prefix</h3>
                          <p className="text-sm text-trioguard-dark/70">
                            The prefix used for bot commands
                          </p>
                        </div>
                        <div className="w-24">
                          <input 
                            type="text" 
                            value={settings.commandPrefix}
                            onChange={(e) => updateSetting('commandPrefix', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="moderation" className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold">Moderation</h2>
                      <p className="text-trioguard-dark/70 text-sm">
                        Configure automated moderation and protection
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Auto Moderation</h3>
                          <p className="text-sm text-trioguard-dark/70">
                            Automatically detect and handle spam, inappropriate content, and raids
                          </p>
                        </div>
                        <Switch
                          checked={settings.autoMod}
                          onCheckedChange={(checked) => updateSetting('autoMod', checked)}
                        />
                      </div>

                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="hover:no-underline">
                            <h3 className="font-medium">Advanced Moderation Settings</h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Anti-Spam Sensitivity</h4>
                                <ToggleGroup type="single" defaultValue="medium">
                                  <ToggleGroupItem value="low">Low</ToggleGroupItem>
                                  <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                                  <ToggleGroupItem value="high">High</ToggleGroupItem>
                                </ToggleGroup>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Filter Profanity</h4>
                                <Switch defaultChecked />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Anti-Raid Protection</h4>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>

                  <div id="welcome" className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold">Welcome Messages</h2>
                      <p className="text-trioguard-dark/70 text-sm">
                        Configure how TrioGuard welcomes new members
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Enable Welcome Messages</h3>
                          <p className="text-sm text-trioguard-dark/70">
                            Send a message when new users join
                          </p>
                        </div>
                        <Switch 
                          checked={settings.welcomeMessages}
                          onCheckedChange={(checked) => updateSetting('welcomeMessages', checked)}
                        />
                      </div>

                      {settings.welcomeMessages && (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="welcome-channel">
                              Welcome Channel
                            </label>
                            <input
                              id="welcome-channel" 
                              type="text" 
                              value={settings.welcomeChannel}
                              onChange={(e) => updateSetting('welcomeChannel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2" htmlFor="welcome-message">
                              Welcome Message
                            </label>
                            <textarea
                              id="welcome-message"
                              rows={3}
                              value={settings.welcomeMessage}
                              onChange={(e) => updateSetting('welcomeMessage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
                              placeholder="Welcome {user} to {server}!"
                            ></textarea>
                            <p className="text-xs text-trioguard-dark/60 mt-1">
                              Use {user} for username, {server} for server name, {mention} to mention the user
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={saveSettings}
                      className="btn-primary px-8"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Server size={48} className="mx-auto text-trioguard-dark/40 mb-4" />
                  <h2 className="text-xl font-bold mb-2">Select a Server</h2>
                  <p className="text-trioguard-dark/70 mb-6">
                    Choose a server from the sidebar to configure TrioGuard
                  </p>
                  <a 
                    href="/#invite" 
                    className="inline-flex items-center text-trioguard hover:underline"
                  >
                    <Shield size={16} className="mr-2" />
                    <span>Need to add TrioGuard to a server?</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
