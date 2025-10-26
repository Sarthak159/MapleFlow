// NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load initial notifications
    const initialNotifications = [
      {
        id: 1,
        type: "crowd",
        title: "Bus Full Alert",
        message:
          "CLS Bus at RPAC is currently full — Next one in 6 minutes is less crowded.",
        time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        icon: "🚌",
        color: "#dc3545",
      },
      {
        id: 2,
        type: "delay",
        title: "Route Delay",
        message: "CABS route delay due to traffic — expect +5 minutes.",
        time: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        read: false,
        icon: "⏰",
        color: "#ffc107",
      },
      {
        id: 3,
        type: "eco",
        title: "Eco Mode Active",
        message:
          "SmartBus+ saved 120 lbs of CO₂ this week by adjusting bus intervals.",
        time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: true,
        icon: "🌱",
        color: "#28a745",
      },
      {
        id: 4,
        type: "comfort",
        title: "Comfort Update",
        message: "CC Bus now has improved air conditioning and smoother ride.",
        time: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        read: true,
        icon: "😊",
        color: "#17a2b8",
      },
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter((n) => !n.read).length);
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      time: new Date(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Show toast notification
    toast.success(notification.message, {
      duration: 4000,
      icon: notification.icon,
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const notificationTypes = [
        {
          type: "crowd",
          title: "Crowd Level Update",
          message:
            "Bus CC now has moderate crowding - comfortable seating available.",
          icon: "👥",
          color: "#ffc107",
        },
        {
          type: "delay",
          title: "Traffic Alert",
          message:
            "Minor delays on CLS route due to construction - expect +2 minutes.",
          icon: "🚧",
          color: "#fd7e14",
        },
        {
          type: "eco",
          title: "Eco Achievement",
          message: "You've contributed to saving 5 lbs of CO₂ today!",
          icon: "🌿",
          color: "#28a745",
        },
        {
          type: "comfort",
          title: "Comfort Alert",
          message: "RPAC Bus temperature adjusted for optimal comfort.",
          icon: "🌡️",
          color: "#17a2b8",
        },
      ];

      // Randomly add notifications (simulate real-time updates)
      if (Math.random() < 0.1) {
        // 10% chance every interval
        const randomNotification =
          notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
          ];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
