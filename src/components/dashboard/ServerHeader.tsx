
import { Server, ExternalLink } from 'lucide-react';

interface ServerHeaderProps {
  serverName: string;
  serverId: string;
}

const ServerHeader = ({ serverName, serverId }: ServerHeaderProps) => {
  const botInviteUrl = "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&integration_type=0&scope=bot+applications.commands";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-4">{serverName}</h1>
          <p className="text-trioguard-dark/80 mb-4">
            Configure TrioGuard settings for your server.
          </p>
          <div className="flex items-center text-sm text-trioguard-dark/60">
            <Server size={16} className="mr-2" />
            <span>Server ID: {serverId}</span>
          </div>
        </div>

        <a 
          href={botInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center text-sm"
        >
          <ExternalLink size={14} className="mr-1" />
          Invite to Another Server
        </a>
      </div>
    </div>
  );
};

export default ServerHeader;
