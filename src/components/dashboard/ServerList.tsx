
import { useState } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Guild = {
  id: string;
  name: string;
  icon: string;
  owner_id: string;
};

interface ServerListProps {
  guilds: Guild[];
  selectedGuild: string | null;
  setSelectedGuild: (id: string) => void;
  isLoading?: boolean;
}

const ServerList = ({
  guilds,
  selectedGuild,
  setSelectedGuild,
  isLoading = false,
}: ServerListProps) => {
  const handleRefresh = () => {
    window.location.reload();
    toast({
      title: "Refreshing servers",
      description: "Reloading your server list...",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-medium mb-4">Your Servers</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <Loader className="animate-spin text-trioguard mb-3" />
          <p className="text-sm text-gray-500">Loading your servers...</p>
        </div>
      </div>
    );
  }

  if (guilds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 animate-fade-in-up">
        <h2 className="font-medium mb-4">Your Servers</h2>
        <div className="flex flex-col items-center justify-center py-6 px-3 space-y-3">
          <AlertCircle className="h-10 w-10 text-yellow-500 mb-2" />
          <p className="text-center text-trioguard-dark/70 text-sm">
            No servers found. Make sure you've:
          </p>
          <ul className="text-xs text-left text-gray-600 space-y-1 w-full list-disc pl-4">
            <li>Invited the bot to your Discord server</li>
            <li>Logged in with the same Discord account</li>
            <li>Given the bot proper permissions</li>
          </ul>
          <Button 
            onClick={handleRefresh}
            className="mt-3 w-full bg-trioguard hover:bg-trioguard/90 text-white"
          >
            Refresh Server List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-fade-in-up">
      <h2 className="font-medium mb-4">Your Servers</h2>
      <div className="space-y-2">
        {guilds.map((guild, index) => (
          <div
            key={guild.id}
            onClick={() => setSelectedGuild(guild.id)}
            className={`p-3 rounded-lg flex items-center cursor-pointer transition-all duration-300 animate-fade-in-up ${
              selectedGuild === guild.id ? "bg-trioguard/10" : "hover:bg-gray-100"
            }`}
            style={{ animationDelay: `${index * 75}ms` }}
            data-guild-id={guild.id}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200 transition-transform ${
              selectedGuild === guild.id ? "scale-110" : ""
            }`}>
              {guild.icon ? (
                <img
                  src={guild.icon}
                  alt={guild.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-trioguard/20 text-trioguard font-medium">
                  {guild.name.substring(0, 2)}
                </div>
              )}
            </div>
            <div className={`ml-3 flex-grow overflow-hidden transition-all duration-300 ${
              selectedGuild === guild.id ? "text-trioguard font-medium" : ""
            }`}>
              <p className="truncate">{guild.name}</p>
            </div>
            <div className={`transform transition-all duration-300 ${
              selectedGuild === guild.id ? "scale-100 opacity-100" : "scale-0 opacity-0" 
            }`}>
              <div className="w-2 h-2 rounded-full bg-trioguard"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerList;
