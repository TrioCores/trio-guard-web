
import { Server, Shield, ExternalLink, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addTestServer } from "@/lib/server";
import { toast } from "@/hooks/use-toast";

interface EmptyServerStateProps {
  botInviteLink?: string;
}

const EmptyServerState = ({ botInviteLink }: EmptyServerStateProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingTest, setIsAddingTest] = useState(false);
  const defaultInviteLink = "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&scope=bot+applications.commands";
  const inviteUrl = botInviteLink || defaultInviteLink;
  
  const handleAddTestServer = async () => {
    setIsAddingTest(true);
    try {
      const result = await addTestServer();
      if (result) {
        toast({
          title: "Test server added",
          description: "A test server has been added to your list",
        });
        window.location.reload(); // Refresh to show the new server
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
      <p className="text-trioguard-dark/70 mb-6">
        You need to invite TrioGuard to your Discord server and make sure you're logged in with the correct Discord account
      </p>
      
      <div className="space-y-4">
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
        
        <div className="mt-6 text-sm text-gray-500 max-w-md mx-auto">
          <h3 className="font-medium mb-2">Troubleshooting steps:</h3>
          <ul className="text-left space-y-1.5">
            <li>✓ Make sure you're logged in with the correct Discord account</li>
            <li>✓ Ensure you OWN the Discord server (not just admin)</li>
            <li>✓ Try logging out and logging back in</li>
            <li>✓ Check browser console for any error messages</li>
          </ul>
          
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Refresh Page
            </Button>
            
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
