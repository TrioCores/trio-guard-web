import { Server, Shield } from "lucide-react";

const EmptyServerState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <Server size={48} className="mx-auto text-trioguard-dark/40 mb-4" />
      <h2 className="text-xl font-bold mb-2">Select a Server</h2>
      <p className="text-trioguard-dark/70 mb-6">
        Choose a server from the sidebar to configure TrioGuard
      </p>
      <a
        href="/#invite"
        className="inline-flex items-center text-trioguard hover:underline"
      >
        <Shield size={16} className="mr-2" />
        <span>Need to add TrioGuard to a server?</span>
      </a>
    </div>
  );
};

export default EmptyServerState;
