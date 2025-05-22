import { useState } from "react";

type Guild = {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  botInstalled: boolean;
};

interface ServerListProps {
  guilds: Guild[];
  selectedGuild: string | null;
  setSelectedGuild: (id: string) => void;
}

const ServerList = ({
  guilds,
  selectedGuild,
  setSelectedGuild,
}: ServerListProps) => {
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
  );
};

export default ServerList;
