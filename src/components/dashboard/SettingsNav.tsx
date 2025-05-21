
import { Settings, Shield, MessageSquare, Bell, Ban, Activity } from 'lucide-react';

const SettingsNav = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-medium mb-4">TrioGuard Settings</h2>
      <nav className="space-y-1">
        {[
          { name: 'General', icon: Settings },
          { name: 'Moderation', icon: Shield },
          { name: 'Welcome', icon: MessageSquare },
          { name: 'Notifications', icon: Bell },
          { name: 'Punishments', icon: Ban },
          { name: 'Logging', icon: Activity },
        ].map(item => (
          <a 
            key={item.name}
            href={`#${item.name.toLowerCase()}`}
            className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <item.icon size={18} className="text-trioguard mr-3" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SettingsNav;
