
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Check, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LoggingSettingsProps {
  serverId: string;
  logChannel?: string;
  onUpdate: (key: string, value: any) => void;
}

const LoggingSettings = ({ serverId, logChannel, onUpdate }: LoggingSettingsProps) => {
  const [loggingEnabled, setLoggingEnabled] = useState<boolean>(!!logChannel);
  const [channel, setChannel] = useState<string>(logChannel || "");
  
  const logEvents = [
    { id: "member_join", name: "Member Join", description: "When a new member joins the server" },
    { id: "member_leave", name: "Member Leave", description: "When a member leaves the server" },
    { id: "message_delete", name: "Message Delete", description: "When a message is deleted" },
    { id: "message_edit", name: "Message Edit", description: "When a message is edited" },
    { id: "role_create", name: "Role Create", description: "When a new role is created" },
    { id: "role_delete", name: "Role Delete", description: "When a role is deleted" },
    { id: "channel_create", name: "Channel Create", description: "When a new channel is created" },
    { id: "channel_delete", name: "Channel Delete", description: "When a channel is deleted" },
    { id: "ban", name: "Ban", description: "When a member is banned" },
    { id: "unban", name: "Unban", description: "When a member is unbanned" },
  ];

  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "member_join", 
    "member_leave", 
    "ban", 
    "unban"
  ]);

  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents(current => 
      current.includes(eventId)
        ? current.filter(id => id !== eventId)
        : [...current, eventId]
    );
  };

  const handleSaveChannel = () => {
    if (loggingEnabled && !channel.trim()) {
      toast({
        title: "Channel name required",
        description: "Please enter a log channel name",
        variant: "destructive"
      });
      return;
    }

    onUpdate('log_channel', loggingEnabled ? channel : null);
    toast({
      title: "Logging settings updated",
      description: loggingEnabled 
        ? `Logs will be sent to #${channel}` 
        : "Logging has been disabled",
      variant: "default"
    });
  };

  const handleLoggingToggle = (enabled: boolean) => {
    setLoggingEnabled(enabled);
    if (!enabled) {
      onUpdate('log_channel', null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold">Logging Configuration</h2>
        <p className="text-trioguard-dark/70 text-sm">
          Configure server event logging
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable Logging</h3>
            <p className="text-sm text-trioguard-dark/70">
              Send logs of server events to a specific channel
            </p>
          </div>
          <Switch 
            checked={loggingEnabled}
            onCheckedChange={handleLoggingToggle}
          />
        </div>
        
        {loggingEnabled && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="log-channel">
                Log Channel
              </label>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <input
                    id="log-channel"
                    type="text"
                    placeholder="e.g. server-logs"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSaveChannel}
                  className="btn-primary px-4 whitespace-nowrap"
                >
                  Save Channel
                </button>
              </div>
              <p className="text-xs text-trioguard-dark/60 mt-1">
                Enter the channel name without the # symbol
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Events to Log</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Select which events should be logged to your log channel
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {logEvents.map(event => (
                  <div 
                    key={event.id}
                    className={`border rounded-md p-3 cursor-pointer ${
                      selectedEvents.includes(event.id) ? 'border-trioguard bg-trioguard/5' : 'border-gray-200'
                    }`}
                    onClick={() => handleToggleEvent(event.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-sm flex items-center justify-center ${
                        selectedEvents.includes(event.id) ? 'bg-trioguard text-white' : 'border border-gray-300'
                      }`}>
                        {selectedEvents.includes(event.id) && <Check size={14} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{event.name}</h4>
                        <p className="text-xs text-gray-500">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggingSettings;
