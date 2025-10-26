// NotificationPanel.js
import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { X, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationPanel = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } =
    useNotifications();

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleRemoveNotification = (notificationId) => {
    removeNotification(notificationId);
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>
        <div className="notification-actions">
          <button onClick={markAllAsRead} className="mark-all-read">
            Mark All Read
          </button>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
            >
              <div
                className="notification-icon"
                style={{ backgroundColor: notification.color }}
              >
                {notification.icon}
              </div>

              <div className="notification-info">
                <div className="notification-title">
                  {notification.title}
                  {!notification.read && <span className="unread-dot" />}
                </div>
                <div className="notification-message">
                  {notification.message}
                </div>
                <div className="notification-time">
                  <Clock size={12} />
                  {formatDistanceToNow(notification.time, { addSuffix: true })}
                </div>
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="mark-read-btn"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleRemoveNotification(notification.id)}
                  className="remove-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
