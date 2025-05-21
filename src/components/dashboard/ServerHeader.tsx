
import { Server } from 'lucide-react';

interface ServerHeaderProps {
  serverName: string;
  serverId: string;
}

const ServerHeader = ({ serverName, serverId }: ServerHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-4">{serverName}</h1>
      <p className="text-trioguard-dark/80 mb-4">
        Configure TrioGuard settings for your server.
      </p>
      <div className="flex items-center text-sm text-trioguard-dark/60">
        <Server size={16} className="mr-2" />
        <span>Server ID: {serverId}</span>
      </div>
    </div>
  );
};

export default ServerHeader;
