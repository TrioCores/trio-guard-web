
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import ServerHeader from './ServerHeader';
import GeneralSettings from './settings/GeneralSettings';
import ModerationSettings from './settings/ModerationSettings';
import WelcomeSettings from './settings/WelcomeSettings';

interface Guild {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  botInstalled: boolean;
}

interface BotSettings {
  autoMod: boolean;
  welcomeMessages: boolean;
  welcomeChannel: string;
  welcomeMessage: string;
  commandPrefix: string;
  [key: string]: any;
}

interface ServerSettingsProps {
  guild: Guild;
  settings: BotSettings;
  setSettings: (settings: BotSettings) => void;
}

const ServerSettings = ({ guild, settings, setSettings }: ServerSettingsProps) => {
  const updateSetting = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const saveSettings = async () => {
    toast({
      title: "Saving settings...",
      description: "Your changes are being saved",
    });
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ServerHeader serverName={guild.name} serverId={guild.id} />
      
      <GeneralSettings 
        commandPrefix={settings.commandPrefix} 
        onUpdate={updateSetting}
      />
      
      <ModerationSettings 
        autoMod={settings.autoMod} 
        onUpdate={updateSetting}
      />
      
      <WelcomeSettings 
        welcomeMessages={settings.welcomeMessages}
        welcomeChannel={settings.welcomeChannel}
        welcomeMessage={settings.welcomeMessage}
        onUpdate={updateSetting}
      />
      
      <div className="flex justify-end">
        <button 
          onClick={saveSettings}
          className="btn-primary px-8"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ServerSettings;
