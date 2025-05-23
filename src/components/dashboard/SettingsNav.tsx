
import { Settings, Shield, MessageSquare, Bell, UsersRound, Activity } from 'lucide-react';

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsNav = ({ activeTab, setActiveTab }: SettingsNavProps) => {
  const navItems = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'moderation', name: 'Moderation', icon: Shield },
    { id: 'welcome', name: 'Welcome', icon: MessageSquare },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'roles', name: 'Role Management', icon: UsersRound },
    { id: 'logging', name: 'Logging', icon: Activity },
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      <h2 className="font-medium mb-4">TrioGuard Settings</h2>
      <nav className="space-y-1">
        {navItems.map((item, index) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full text-left items-center p-2 rounded-md transition-all duration-300 animate-fade-in-up ${
              activeTab === item.id 
                ? "bg-trioguard/10 text-trioguard translate-x-1" 
                : "hover:bg-gray-100 hover:translate-x-1"
            }`}
            style={{ animationDelay: `${200 + index * 50}ms` }}
          >
            <item.icon 
              size={18} 
              className={`mr-3 transition-all duration-300 ${
                activeTab === item.id 
                  ? "text-trioguard scale-110" 
                  : "text-gray-500"
              }`} 
            />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsNav;
