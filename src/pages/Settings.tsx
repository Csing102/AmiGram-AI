import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface UserSettings {
  notifications: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    messages: boolean;
  };
  privacy: {
    privateAccount: boolean;
    showOnlineStatus: boolean;
    allowMessageRequests: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

export default function Settings() {
  const { user, signOut } = useAuthStore();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
    },
    privacy: {
      privateAccount: false,
      showOnlineStatus: true,
      allowMessageRequests: true,
    },
    theme: 'light',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      // Settings don't exist yet, use defaults
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          settings: settings,
        });

      if (error) throw error;
      toast.success('Settings saved!');
    } catch (error: any) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSetting = (key: keyof UserSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updatePrivacySetting = (key: keyof UserSettings['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
        </div>

        {/* Account Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
              <button className="btn-secondary">Change</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-gray-600 text-sm">Last changed 30 days ago</p>
              </div>
              <button className="btn-secondary">Change</button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{key}</p>
                  <p className="text-gray-600 text-sm">
                    Get notified when someone {key === 'follows' ? 'follows you' : `${key} your posts`}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateNotificationSetting(key as keyof UserSettings['notifications'], e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h2>
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {key === 'privateAccount' && 'Private Account'}
                    {key === 'showOnlineStatus' && 'Show Online Status'}
                    {key === 'allowMessageRequests' && 'Allow Message Requests'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {key === 'privateAccount' && 'Only followers can see your posts'}
                    {key === 'showOnlineStatus' && 'Let others see when you\'re online'}
                    {key === 'allowMessageRequests' && 'Allow messages from people you don\'t follow'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updatePrivacySetting(key as keyof UserSettings['privacy'], e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
          <div>
            <p className="font-medium text-gray-900 mb-2">Theme</p>
            <div className="flex space-x-4">
              {(['light', 'dark', 'auto'] as const).map((theme) => (
                <label key={theme} className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={settings.theme === theme}
                    onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                    className="mr-2"
                  />
                  <span className="capitalize">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-4">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={signOut}
              className="w-full text-red-600 hover:text-red-700 font-medium py-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}