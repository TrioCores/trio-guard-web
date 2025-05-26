
import { useState, useEffect } from "react";
import ServerList from "./ServerList";
import SettingsNav from "./SettingsNav";
import EmptyServerState from "./EmptyServerState";
import ServerSettings from "./ServerSettings";
import RoleManagement from "./settings/RoleManagement";
import LoggingSettings from "./settings/LoggingSettings";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { RefetchOptions } from "@tanstack/react-query";

interface DashboardContentProps {
  guilds: any[];
  selectedGuild: string | null;
  setSelectedGuild: (id: string) => void;
  activeSettingTab: string;
  setActiveSettingTab: (tab: string) => void;
  isLoadingServers: boolean;
  isLoadingSettings: boolean;
  settings: any;
  currentGuild: any;
  profiles?: any;
  handleSettingsUpdate: (key: string, value: any) => void;
  discordStatus: string;
  onRefreshServers: (options?: RefetchOptions) => Promise<any>;
}

const DashboardContent = ({
  guilds,
  selectedGuild,
  setSelectedGuild,
  activeSettingTab,
  setActiveSettingTab,
  isLoadingServers,
  isLoadingSettings,
  settings,
  currentGuild,
  handleSettingsUpdate,
  discordStatus,
  onRefreshServers,
}: DashboardContentProps) => {
  const botInviteLink =
    "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&integration_type=0&scope=bot+applications.commands";
  const [contentKey, setContentKey] = useState<string>("initial");

  // Generate a new key when the guild or tab changes to trigger re-animations
  useEffect(() => {
    setContentKey(
      `${selectedGuild || "none"}-${activeSettingTab}-${Date.now()}`
    );
  }, [selectedGuild, activeSettingTab]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="mb-6">
          <ServerList
            guilds={guilds}
            selectedGuild={selectedGuild}
            setSelectedGuild={setSelectedGuild}
            isLoading={isLoadingServers}
          />
        </div>

        {selectedGuild && (
          <SettingsNav
            activeTab={activeSettingTab}
            setActiveTab={setActiveSettingTab}
          />
        )}
      </aside>

      {/* Main content */}
      <div className="flex-grow">
        {isLoadingSettings && selectedGuild ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center animate-fade-in-up">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-trioguard/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-t-trioguard border-r-trioguard border-b-transparent border-l-transparent animate-spin"></div>
                </div>
              </div>
              <h2 className="text-xl font-medium text-trioguard-dark">
                Loading settings...
              </h2>
              <div className="w-full max-w-md space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-3/4" />
              </div>
            </div>
          </div>
        ) : selectedGuild && currentGuild && settings ? (
          <div
            key={contentKey}
            className={cn("transition-all duration-300 animate-fade-in-up")}
          >
            {activeSettingTab === "general" && (
              <ServerSettings
                guild={currentGuild}
                settings={settings}
                onUpdate={handleSettingsUpdate}
              />
            )}
            {activeSettingTab === "roles" && (
              <RoleManagement serverId={selectedGuild} />
            )}
            {activeSettingTab === "logging" && (
              <LoggingSettings
                serverId={selectedGuild}
                logChannel={settings.log_channel}
                onUpdate={handleSettingsUpdate}
              />
            )}
          </div>
        ) : (
          <EmptyServerState 
            botInviteLink={botInviteLink}
            discordStatus={discordStatus}
            onRefreshServers={onRefreshServers}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
