
import { useState } from 'react';

interface GeneralSettingsProps {
  commandPrefix: string;
  onUpdate: (key: string, value: any) => void;
}

const GeneralSettings = ({ commandPrefix, onUpdate }: GeneralSettingsProps) => {
  return (
    <div id="general" className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold">General Settings</h2>
        <p className="text-trioguard-dark/70 text-sm">
          Basic configuration for TrioGuard
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Command Prefix</h3>
            <p className="text-sm text-trioguard-dark/70">
              The prefix used for bot commands
            </p>
          </div>
          <div className="w-24">
            <input 
              type="text" 
              value={commandPrefix}
              onChange={(e) => onUpdate('commandPrefix', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-trioguard focus:border-transparent"
              maxLength={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
