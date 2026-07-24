import React, { useState } from 'react';
import Header from '../components/layout/Header';

// Reusable toggle switch component
const Toggle = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    sessionTimeout: '30',
    twoFactor: false
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Placeholder
    alert("Settings saved successfully!");
  };

  return (
    <div className="animate-fade-in p-6 max-w-4xl mx-auto">
      <Header title="Settings" subtitle="Application preferences" />
      
      <div className="space-y-6 mt-6">
        
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">General</h3>
          <p className="text-sm text-gray-500 mb-6">Basic application configurations.</p>
          
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
              <input 
                type="text" 
                value="Employee Management System" 
                readOnly 
                className="w-full bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-4 py-2 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
              <input 
                type="text" 
                value="/api" 
                readOnly 
                className="w-full bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-4 py-2 focus:outline-none font-mono text-sm" 
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Appearance</h3>
          <p className="text-sm text-gray-500 mb-6">Customize how the application looks.</p>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-500">Enable dark theme for the interface (Coming soon)</p>
            </div>
            <Toggle 
              enabled={settings.theme === 'dark'} 
              onChange={(val) => updateSetting('theme', val ? 'dark' : 'light')} 
            />
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Notifications</h3>
          <p className="text-sm text-gray-500 mb-6">Manage how you receive alerts.</p>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive system updates via email</p>
              </div>
              <Toggle 
                enabled={settings.emailNotifications} 
                onChange={(val) => updateSetting('emailNotifications', val)} 
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive alerts in your browser</p>
              </div>
              <Toggle 
                enabled={settings.pushNotifications} 
                onChange={(val) => updateSetting('pushNotifications', val)} 
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Security</h3>
          <p className="text-sm text-gray-500 mb-6">Protect your account and data.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Toggle 
                enabled={settings.twoFactor} 
                onChange={(val) => updateSetting('twoFactor', val)} 
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">Log out automatically after inactivity</p>
              </div>
              <select 
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <h3 className="text-lg font-bold text-red-700 mb-1">Danger Zone</h3>
          <p className="text-sm text-red-600/80 mb-4">Irreversible and destructive actions.</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700">Permanently remove your account and data</p>
            </div>
            <button className="btn btn-danger bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end pt-4 pb-10">
          <button 
            onClick={handleSave}
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
