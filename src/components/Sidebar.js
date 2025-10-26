// Sidebar.js - MapleFlow Navigation
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, MapPin, MessageSquare, BarChart3, User } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Live Routes', icon: Bus },
    { path: '/stops', label: 'Find My Stop', icon: MapPin },
    { path: '/feedback', label: 'Report Crowd', icon: MessageSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="sidebar-buckeyeride">
      {/* Logo */}
      <div className="sidebar-logo">
        <img 
          src="/mapleflow-logo.svg" 
          alt="MapleFlow Logo" 
          className="logo-image"
        />
        <div className="logo-text">
          <h2 className="logo-title">MapleFlow</h2>
          <p className="logo-subtitle">Transit Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar-small">
          <User size={24} />
        </div>
        <div className="profile-info-small">
          <p className="profile-name">Student</p>
          <p className="profile-role">Campus Transit</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

