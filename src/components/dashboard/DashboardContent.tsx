
import { useState } from 'react';
import ServerList from './ServerList';
import SettingsNav from './SettingsNav';
import EmptyServerState from './EmptyServerState';
import ServerSettings from './ServerSettings';
import RoleManagement from './settings/RoleManagement';
import LoggingSettings from './settings/LoggingSettings';

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
  handleSettingsUpdate: (key: string, value: any) => void;
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
}: DashboardContentProps) => {
  const botInviteLink = "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&integration_type=0&scope=bot+applications.commands";

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
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-pulse-soft inline-flex items-center justify-center p-4 bg-white rounded-full shadow-md mb-4">
              <div className="w-8 h-8 text-trioguard">Loading...</div>
            </div>
            <h2 className="text-xl font-medium text-trioguard-dark">Loading settings...</h2>
          </div>
        ) : selectedGuild && currentGuild && settings ? (
          <>
            {activeSettingTab === 'general' && (
              <ServerSettings 
                guild={currentGuild}
                settings={settings}
                onUpdate={handleSettingsUpdate}
              />
            )}
            {activeSettingTab === 'roles' && (
              <RoleManagement 
                serverId={selectedGuild}
              />
            )}
            {activeSettingTab === 'logging' && (
              <LoggingSettings 
                serverId={selectedGuild}
                logChannel={settings.log_channel}
                onUpdate={handleSettingsUpdate}
              />
            )}
          </>
        ) : (
          <EmptyServerState botInviteLink={botInviteLink} />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
