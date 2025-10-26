// Navigation.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { Home, BarChart3, MessageSquare, Settings, Bell } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/feedback", label: "Feedback", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="navigation">
      <div className="nav-content">
        <Link to="/" className="logo">
          🚌 Maple Flow
        </Link>

        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link to={item.path} className={isActive ? "active" : ""}>
                  <Icon size={18} />
                  {item.label}
                  {item.path === "/" && unreadCount > 0 && (
                    <span className="nav-notification-badge">
                      <Bell size={12} />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
