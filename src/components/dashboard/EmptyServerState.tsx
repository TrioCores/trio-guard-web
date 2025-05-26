
import { Server, Shield, ExternalLink, Plus, AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addTestServer, checkDiscordOAuthStatus } from "@/lib/server";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EmptyServerStateProps {
  botInviteLink?: string;
  discordStatus?: string;
  onRefresh?: () => void;
}

const EmptyServerState = ({ botInviteLink, discordStatus, onRefresh }: EmptyServerStateProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [oauthStatus, setOauthStatus] = useState<any>(null);
  const defaultInviteLink = "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&scope=bot+applications.commands";
  const inviteUrl = botInviteLink || defaultInviteLink;
  
  useEffect(() => {
    checkDiscordOAuthStatus().then(setOauthStatus);
  }, []);
  
  const handleAddTestServer = async () => {
    setIsAddingTest(true);
    try {
      const result = await addTestServer();
      if (result) {
        toast({
          title: "Test server added",
          description: "A test server has been added to your list",
        });
        if (onRefresh) onRefresh();
      } else {
        toast({
          title: "Failed to add test server",
          description: "There was an error adding the test server",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding test server:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAddingTest(false);
    }
  };

  const handleLogoutAndReauth = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "Please log back in to refresh your Discord connection",
      });
      // Redirect to login
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getStatusMessage = () => {
    if (!oauthStatus) return "Checking Discord connection...";
    
    switch (oauthStatus.status) {
      case 'no_session':
        return "Please log in with Discord first";
      case 'wrong_provider':
        return "Please log in using Discord (not email)";
      case 'no_token':
        return "Discord token expired - please log out and log back in";
      case 'valid':
        return "Discord connection is working properly";
      default:
        return "Unknown Discord connection status";
    }
  };

  const getStatusIcon = () => {
    if (!oauthStatus) return <RefreshCw className="w-5 h-5 animate-spin" />;
    
    switch (oauthStatus.status) {
      case 'valid':
        return <Shield className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const showTokenExpiredActions = oauthStatus?.status === 'no_token' || discordStatus === 'no_token';
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center animate-fade-in-up">
      <div className="relative mb-6 inline-block">
        <Server 
          size={64} 
          className="mx-auto text-trioguard-dark/40 transition-all duration-500 transform" 
        />
        <div className={`absolute inset-0 bg-trioguard-light/20 rounded-full scale-0 transition-all duration-500 ${isHovering ? 'scale-150 opacity-0' : 'scale-0 opacity-0'}`}></div>
      </div>
      
      <h2 className="text-xl font-bold mb-2">No Servers Found</h2>
      
      {/* Discord Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getStatusIcon()}
          <span className="font-medium">Discord Status</span>
        </div>
        <p className="text-sm text-gray-600">{getStatusMessage()}</p>
      </div>
      
      <p className="text-trioguard-dark/70 mb-6">
        You need to invite TrioGuard to your Discord server and make sure you're the server owner
      </p>
      
      <div className="space-y-4">
        {showTokenExpiredActions ? (
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-3">
                Your Discord authentication has expired. Please log out and log back in to refresh your connection.
              </p>
              <Button
                onClick={handleLogoutAndReauth}
                disabled={isLoggingOut}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <LogOut size={16} className="mr-2" />
                {isLoggingOut ? 'Logging out...' : 'Log Out & Re-authenticate'}
              </Button>
            </div>
          </div>
        ) : (
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-trioguard hover:bg-trioguard/90 text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Shield size={16} className={`mr-2 transition-all duration-300 ${isHovering ? 'rotate-12' : ''}`} />
            <span>Invite TrioGuard to a Server</span>
            <ExternalLink size={14} className="ml-1.5 opacity-70" />
          </a>
        )}
        
        <div className="mt-6 text-sm text-gray-500 max-w-md mx-auto">
          <h3 className="font-medium mb-2">Troubleshooting steps:</h3>
          <ul className="text-left space-y-1.5">
            <li>✓ Make sure you're logged in with Discord (not email)</li>
            <li>✓ Ensure you OWN the Discord server (not just admin)</li>
            <li>✓ Invite the bot to your server with proper permissions</li>
            <li>✓ Try logging out and logging back in if token expired</li>
          </ul>
          
          <div className="flex flex-col gap-2 mt-4">
            {onRefresh && !showTokenExpiredActions && (
              <Button
                onClick={onRefresh}
                variant="outline"
                className="w-full"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh Servers
              </Button>
            )}
            
            {!showTokenExpiredActions && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
            )}
            
            <Button
              onClick={handleAddTestServer}
              variant="outline"
              className="w-full"
              disabled={isAddingTest}
            >
              <Plus size={16} className="mr-2" />
              {isAddingTest ? 'Adding...' : 'Add Test Server (Debug)'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyServerState;
