
import { Server, Shield, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EmptyServerStateProps {
  botInviteLink?: string;
}

const EmptyServerState = ({ botInviteLink }: EmptyServerStateProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const defaultInviteLink = "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&scope=bot+applications.commands";
  const inviteUrl = botInviteLink || defaultInviteLink;
  
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
        You need to invite TrioGuard to your Discord server to get started
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
            <li>✓ Ensure you've granted the bot proper permissions</li>
            <li>✓ Try refreshing the page after inviting the bot</li>
            <li>✓ Check that you have 'Manage Server' permissions on Discord</li>
          </ul>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4 w-full"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyServerState;
