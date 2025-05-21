
import { Switch } from "@/components/ui/switch";

interface WelcomeSettingsProps {
  welcomeMessages: boolean;
  welcomeChannel: string;
  welcomeMessage: string;
  onUpdate: (key: string, value: any) => void;
}

const WelcomeSettings = ({ 
  welcomeMessages, 
  welcomeChannel, 
  welcomeMessage, 
  onUpdate 
}: WelcomeSettingsProps) => {
  return (
    <div id="welcome" className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold">Welcome Messages</h2>
        <p className="text-trioguard-dark/70 text-sm">
          Configure how TrioGuard welcomes new members
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Welcome Messages</h3>
            <p className="text-sm text-trioguard-dark/70">
              Send a message when new users join
            </p>
          </div>
          <Switch 
            checked={welcomeMessages}
            onCheckedChange={(checked) => onUpdate('welcomeMessages', checked)}
          />
        </div>

        {welcomeMessages && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="welcome-channel">
                Welcome Channel
              </label>
              <input
                id="welcome-channel" 
                type="text" 
                value={welcomeChannel}
                onChange={(e) => onUpdate('welcomeChannel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="welcome-message">
                Welcome Message
              </label>
              <textarea
                id="welcome-message"
                rows={3}
                value={welcomeMessage}
                onChange={(e) => onUpdate('welcomeMessage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
                placeholder="Welcome {user} to {server}!"
              ></textarea>
              <p className="text-xs text-trioguard-dark/60 mt-1">
                Use {"{user}"} for username, {"{server}"} for server name, {"{mention}"} to mention the user
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeSettings;
