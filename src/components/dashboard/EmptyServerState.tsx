
import { Server, Shield } from "lucide-react";

interface EmptyServerStateProps {
  botInviteLink?: string;
}

const EmptyServerState = ({ botInviteLink }: EmptyServerStateProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <Server size={48} className="mx-auto text-trioguard-dark/40 mb-4" />
      <h2 className="text-xl font-bold mb-2">Select a Server</h2>
      <p className="text-trioguard-dark/70 mb-6">
        Choose a server from the sidebar to configure TrioGuard
      </p>
      <a
        href={botInviteLink || "#invite"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-trioguard hover:bg-trioguard/90 text-white py-2 px-4 rounded-md transition-colors"
      >
        <Shield size={16} className="mr-2" />
        <span>Invite TrioGuard to a Server</span>
      </a>
    </div>
  );
};

export default EmptyServerState;
