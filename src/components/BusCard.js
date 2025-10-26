// BusCard.js - MapleFlow Dashboard Design
import React from 'react';
import { Users, TrendingUp, Bus, Clock, MapPin } from 'lucide-react';

const BusCard = ({ bus, nextBus, onClick }) => {
  const getRouteColor = (route) => {
    const colors = {
      'CC': '#dc2626',
      'BE': '#3b82f6',
      'CLS': '#ef4444',
      'ER': '#10b981',
      'MC': '#8b5cf6',
      'NWC': '#ec4899',
      'WMC': '#06b6d4'
    };
    return colors[route] || '#6366f1';
  };

  const getCrowdBadgeClass = (level) => {
    switch (level) {
      case 'low': return 'crowd-badge-dashboard low';
      case 'medium': return 'crowd-badge-dashboard medium';
      case 'high': return 'crowd-badge-dashboard high';
      default: return 'crowd-badge-dashboard low';
    }
  };

  const getCrowdText = (level) => {
    switch (level) {
      case 'low': return 'low';
      case 'medium': return 'medium';
      case 'high': return 'high';
      default: return 'low';
    }
  };

  const occupancyPercent = Math.round((bus.passengerCount / bus.capacity) * 100);

  const getOccupancyColor = (percent) => {
    if (percent <= 40) return '#10b981'; // Green
    if (percent <= 70) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="bus-card-dashboard" onClick={() => onClick && onClick(bus)}>
      <div className="bus-card-dashboard-header">
        <div className="bus-route-icon" style={{ backgroundColor: getRouteColor(bus.route) }}>
          <Users size={24} color="white" />
        </div>
        <div className="bus-card-title">
          <h3 className="bus-route-name">{bus.id}</h3>
          <p className="bus-route-desc">{bus.destination}</p>
        </div>
        <span className={getCrowdBadgeClass(bus.crowdLevel)}>
          {getCrowdText(bus.crowdLevel)}
        </span>
      </div>

      <div className="bus-card-dashboard-body">
        <div className="bus-metric">
          <Users size={18} className="metric-icon" />
          <span className="metric-label">Occupancy</span>
          <span className="metric-value" style={{ color: getOccupancyColor(occupancyPercent), fontWeight: 'bold' }}>
            {occupancyPercent}%
          </span>
        </div>

        <div className="bus-metric">
          <TrendingUp size={18} className="metric-icon" />
          <span className="metric-label">Comfort Index</span>
          <span className="metric-value">{bus.comfortScore}/10</span>
        </div>

        <div className="bus-metric">
          <Bus size={18} className="metric-icon" />
          <span className="metric-label">Next {bus.route}</span>
          {nextBus ? (
            <span className="metric-value">
              {nextBus.eta} min{' '}
              <span style={{ 
                color: getOccupancyColor(Math.round((nextBus.passengerCount / nextBus.capacity) * 100)),
                fontWeight: 'bold'
              }}>
                ({Math.round((nextBus.passengerCount / nextBus.capacity) * 100)}%)
              </span>
            </span>
          ) : (
            <span className="metric-value">N/A</span>
          )}
        </div>

        <div className="bus-metric">
          <Clock size={18} className="metric-icon" />
          <span className="metric-label">Next Stop</span>
          <span className="metric-value metric-value-primary">{bus.eta} min</span>
        </div>
      </div>

      <div className="bus-card-dashboard-footer">
        <MapPin size={16} className="footer-icon" />
        <span className="footer-label">Currently at</span>
        <span className="footer-value">{bus.currentStop?.toLowerCase()}</span>
      </div>
    </div>
  );
};

export default BusCard;
