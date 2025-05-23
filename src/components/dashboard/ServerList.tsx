
import { useState } from "react";
import { Loader } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-medium mb-4">Your Servers</h2>
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-trioguard" />
        </div>
      </div>
    );
  }

  if (guilds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-medium mb-4">Your Servers</h2>
        <p className="text-center py-4 text-trioguard-dark/60">
          No servers found. Invite the bot to your Discord server to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-medium mb-4">Your Servers</h2>
      <div className="space-y-2">
        {guilds.map((guild) => (
          <div
            key={guild.id}
            onClick={() => setSelectedGuild(guild.id)}
            className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${
              selectedGuild === guild.id
                ? "bg-trioguard/10 border border-trioguard/30"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200">
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
            <div className="ml-3 flex-grow overflow-hidden">
              <p className="font-medium truncate">{guild.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerList;
