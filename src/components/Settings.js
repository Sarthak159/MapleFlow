// Settings.js - MapleFlow Design
import React, { useState } from 'react';
import { Bell, MapPin, Moon, User, ChevronRight, Shield, Info } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      crowdAlerts: true,
      delayAlerts: true,
      ecoModeUpdates: true,
      comfortAlerts: false
    },
    preferences: {
      darkMode: false,
      autoRefresh: true,
      refreshInterval: 30,
      soundEnabled: true,
      vibrationEnabled: true
    },
    location: {
      trackingEnabled: true,
      shareLocation: false,
      nearbyStops: true
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const SettingToggle = ({ label, description, checked, onChange }) => (
    <div className="setting-item-mapleflow">
      <div className="setting-info-mapleflow">
        <div className="setting-label-mapleflow">{label}</div>
        <div className="setting-description-mapleflow">{description}</div>
      </div>
      <label className="toggle-switch-mapleflow">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="toggle-slider-mapleflow"></span>
      </label>
    </div>
  );

  const SettingLink = ({ icon: Icon, label, badge }) => (
    <div className="setting-link-mapleflow">
      <div className="setting-link-left">
        <div className="setting-icon-wrapper">
          <Icon size={20} />
        </div>
        <span className="setting-link-label">{label}</span>
      </div>
      <div className="setting-link-right">
        {badge && <span className="setting-badge">{badge}</span>}
        <ChevronRight size={20} className="chevron-icon" />
      </div>
    </div>
  );

  return (
    <div className="settings-page-mapleflow">
      <div className="settings-header-mapleflow">
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        {/* Profile Section */}
        <div className="settings-section-mapleflow profile-section">
          <div className="profile-avatar">
            <User size={32} />
          </div>
          <div className="profile-info">
            <h3>MapleFlow User</h3>
            <p>user@example.com</p>
          </div>
          <ChevronRight size={20} className="profile-arrow" />
        </div>

        {/* Notifications Section */}
        <div className="settings-section-mapleflow">
          <div className="section-header-mapleflow">
            <Bell size={20} className="section-icon" />
            <h2>Notifications</h2>
          </div>
          
          <SettingToggle
            label="Crowd Level Alerts"
            description="Get notified when buses become less crowded"
            checked={settings.notifications.crowdAlerts}
            onChange={() => handleToggle('notifications', 'crowdAlerts')}
          />
          
          <SettingToggle
            label="Delay Alerts"
            description="Receive notifications about route delays"
            checked={settings.notifications.delayAlerts}
            onChange={() => handleToggle('notifications', 'delayAlerts')}
          />
          
          <SettingToggle
            label="Eco Mode Updates"
            description="Learn about environmental impact savings"
            checked={settings.notifications.ecoModeUpdates}
            onChange={() => handleToggle('notifications', 'ecoModeUpdates')}
          />
        </div>

        {/* Preferences Section */}
        <div className="settings-section-mapleflow">
          <div className="section-header-mapleflow">
            <Moon size={20} className="section-icon" />
            <h2>Preferences</h2>
          </div>
          
          <SettingToggle
            label="Auto Refresh"
            description="Automatically update bus information"
            checked={settings.preferences.autoRefresh}
            onChange={() => handleToggle('preferences', 'autoRefresh')}
          />
          
          <SettingToggle
            label="Sound Notifications"
            description="Play sounds for important alerts"
            checked={settings.preferences.soundEnabled}
            onChange={() => handleToggle('preferences', 'soundEnabled')}
          />
        </div>

        {/* Location Section */}
        <div className="settings-section-mapleflow">
          <div className="section-header-mapleflow">
            <MapPin size={20} className="section-icon" />
            <h2>Location & Privacy</h2>
          </div>
          
          <SettingToggle
            label="Location Tracking"
            description="Allow app to track your location for better recommendations"
            checked={settings.location.trackingEnabled}
            onChange={() => handleToggle('location', 'trackingEnabled')}
          />
        </div>

        {/* Other Settings Links */}
        <div className="settings-section-mapleflow">
          <SettingLink icon={Shield} label="Privacy Policy" />
          <SettingLink icon={Info} label="About MapleFlow" badge="v1.0.0" />
        </div>
      </div>
    </div>
  );
};

export default Settings;


