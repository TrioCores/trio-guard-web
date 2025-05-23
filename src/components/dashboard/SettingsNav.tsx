
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
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-medium mb-4">TrioGuard Settings</h2>
      <nav className="space-y-1">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full text-left items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${
              activeTab === item.id ? "bg-trioguard/10 text-trioguard" : ""
            }`}
          >
            <item.icon size={18} className={`mr-3 ${activeTab === item.id ? "text-trioguard" : "text-gray-500"}`} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsNav;
