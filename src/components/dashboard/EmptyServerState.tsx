
import { Server, Shield } from "lucide-react";
import { useState } from "react";

interface EmptyServerStateProps {
  botInviteLink?: string;
}

const EmptyServerState = ({ botInviteLink }: EmptyServerStateProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center animate-fade-in-up">
      <div className="relative mb-6 inline-block">
        <Server 
          size={64} 
          className="mx-auto text-trioguard-dark/40 transition-all duration-500 transform" 
        />
        <div className={`absolute inset-0 bg-trioguard-light/20 rounded-full scale-0 transition-all duration-500 ${isHovering ? 'scale-150 opacity-0' : 'scale-0 opacity-0'}`}></div>
      </div>
      <h2 className="text-xl font-bold mb-2">Select a Server</h2>
      <p className="text-trioguard-dark/70 mb-6">
        Choose a server from the sidebar to configure TrioGuard
      </p>
      <a
        href={botInviteLink || "#invite"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-trioguard hover:bg-trioguard/90 text-white py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Shield size={16} className={`mr-2 transition-all duration-300 ${isHovering ? 'rotate-12' : ''}`} />
        <span>Invite TrioGuard to a Server</span>
      </a>
    </div>
  );
};

export default EmptyServerState;
