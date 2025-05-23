
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "@/hooks/use-toast";
import ServerHeader from "./ServerHeader";
import GeneralSettings from "./settings/GeneralSettings";
import ModerationSettings from "./settings/ModerationSettings";
import WelcomeSettings from "./settings/WelcomeSettings";

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
  // Add missing properties that exist in mockSettings
  logChannel: string;
  enableWarnings: boolean;
  maxWarnings: number;
  muteRole: string;
  moderationRoles: string[];
  customCommands: Array<{ name: string; response: string }>;
  [key: string]: any;
}

interface ServerSettingsProps {
  guild: Guild;
  settings: BotSettings;
  onUpdate?: (key: string, value: any) => void;  // Make onUpdate optional
  setSettings?: Dispatch<SetStateAction<BotSettings>>;  // Keep setSettings for backward compatibility
}

const ServerSettings = ({
  guild,
  settings,
  setSettings,
  onUpdate,
}: ServerSettingsProps) => {
  // Internal update method that works with either prop pattern
  const updateSetting = (key: string, value: any) => {
    if (onUpdate) {
      // Use onUpdate if provided
      onUpdate(key, value);
    } else if (setSettings) {
      // Fall back to setSettings if available
      setSettings((prevSettings) => ({
        ...prevSettings,
        [key]: value,
      }));
    }
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

      <ModerationSettings autoMod={settings.autoMod} onUpdate={updateSetting} />

      <WelcomeSettings
        welcomeMessages={settings.welcomeMessages}
        welcomeChannel={settings.welcomeChannel}
        welcomeMessage={settings.welcomeMessage}
        onUpdate={updateSetting}
      />

      <div className="flex justify-end">
        <button onClick={saveSettings} className="btn-primary px-8">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ServerSettings;
