// FindMyStop.js - MapleFlow Find My Stop Feature
import React, { useState } from 'react';
import { MapPin, Clock, Bus, Star } from 'lucide-react';
import { useBus } from '../context/BusContext';

const FindMyStop = () => {
  const { buses, stops, toggleFavoriteStop } = useBus();
  const [selectedStop, setSelectedStop] = useState(null);

  // Get buses arriving at the selected stop
  const getBusesForStop = (stopName) => {
    return buses.filter(bus => {
      // Check if bus is currently at this stop
      if (bus.currentStop?.toLowerCase() === stopName.toLowerCase()) {
        return true;
      }
      // Check if this stop is in the bus's next stops
      if (bus.nextStops) {
        return bus.nextStops.some(stop => 
          stop.name.toLowerCase() === stopName.toLowerCase()
        );
      }
      return false;
    }).map(bus => {
      // Calculate ETA for this specific stop
      const nextStopMatch = bus.nextStops?.find(stop => 
        stop.name.toLowerCase() === stopName.toLowerCase()
      );
      return {
        ...bus,
        etaToStop: nextStopMatch ? nextStopMatch.eta : bus.eta
      };
    }).sort((a, b) => a.etaToStop - b.etaToStop);
  };

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
      case 'low': return 'crowd-badge-stop low';
      case 'medium': return 'crowd-badge-stop medium';
      case 'high': return 'crowd-badge-stop high';
      default: return 'crowd-badge-stop low';
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

  const getExpectedTime = (eta) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + eta);
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getOccupancyPercent = (bus) => {
    return Math.round((bus.passengerCount / bus.capacity) * 100);
  };

  const getOccupancyGradient = (percent) => {
    if (percent <= 40) {
      // Low occupancy - green gradient
      return 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (percent <= 70) {
      // Medium occupancy - yellow/orange gradient
      return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    } else {
      // High occupancy - red gradient
      return 'linear-gradient(90deg, #ef4444, #f87171)';
    }
  };

  const getOccupancyColor = (percent) => {
    if (percent <= 40) return '#10b981'; // Green
    if (percent <= 70) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
  };

  // Get next bus of the same route
  const getNextBusOfSameRoute = (currentBus, currentStopName) => {
    const busesAtStop = getBusesForStop(currentStopName);
    const samRouteBuses = busesAtStop
      .filter(bus => bus.route === currentBus.route && bus.etaToStop > currentBus.etaToStop)
      .sort((a, b) => a.etaToStop - b.etaToStop);
    
    return samRouteBuses.length > 0 ? samRouteBuses[0] : null;
  };

  if (!selectedStop) {
    // Stop Selection View
    return (
      <div className="find-my-stop-page">
        <div className="stop-selection-header">
          <div className="stop-selection-icon">
            <MapPin size={32} />
          </div>
          <div className="stop-selection-title">
            <h1>Select Your Stop</h1>
            <p>Choose from {stops.length} campus locations</p>
          </div>
        </div>

        <div className="stops-grid">
          {stops.map((stop) => (
            <div key={stop.id} className="stop-item-wrapper">
              <button
                className={`stop-item-button ${stop.isFavorite ? 'favorite' : ''}`}
                onClick={() => setSelectedStop(stop)}
              >
                <MapPin size={20} className="stop-item-icon" />
                <span className="stop-item-name">{stop.name}</span>
              </button>
              <button
                className={`favorite-stop-btn ${stop.isFavorite ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteStop(stop.id);
                }}
                title={stop.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star 
                  size={20} 
                  fill={stop.isFavorite ? '#fbbf24' : 'none'}
                  stroke={stop.isFavorite ? '#fbbf24' : '#9ca3af'}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Selected Stop View
  const busesAtStop = getBusesForStop(selectedStop.name);

  return (
    <div className="find-my-stop-page">
      <button 
        className="back-to-stops-btn"
        onClick={() => setSelectedStop(null)}
      >
        ← Back to all stops
      </button>

      <div className="selected-stop-header">
        <div className="selected-stop-title-row">
          <div>
            <h1>{selectedStop.name}</h1>
            <p className="buses-arriving-text">
              {busesAtStop.length} {busesAtStop.length === 1 ? 'bus' : 'buses'} arriving soon
            </p>
          </div>
          <button
            className={`favorite-stop-btn-large ${selectedStop.isFavorite ? 'active' : ''}`}
            onClick={() => toggleFavoriteStop(selectedStop.id)}
            title={selectedStop.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star 
              size={28} 
              fill={selectedStop.isFavorite ? '#fbbf24' : 'none'}
              stroke={selectedStop.isFavorite ? '#fbbf24' : '#9ca3af'}
            />
          </button>
        </div>
      </div>

      <div className="stop-buses-list">
        {busesAtStop.length === 0 ? (
          <div className="no-buses-message">
            <Bus size={48} />
            <p>No buses arriving at this stop soon</p>
            <span>Check back later or select another stop</span>
          </div>
        ) : (
          busesAtStop.map((bus) => {
            const nextBus = getNextBusOfSameRoute(bus, selectedStop.name);
            const currentOccupancy = getOccupancyPercent(bus);
            
            return (
              <div key={bus.id} className="stop-bus-card">
                <div className="stop-bus-header">
                  <div 
                    className="stop-bus-icon" 
                    style={{ backgroundColor: getRouteColor(bus.route) }}
                  >
                    <Bus size={24} color="white" />
                  </div>
                  <div className="stop-bus-info">
                    <h3 className="stop-bus-route">{bus.id}</h3>
                    <p className="stop-bus-label">Bus ID</p>
                  </div>
                  <span className={getCrowdBadgeClass(bus.crowdLevel)}>
                    {getCrowdText(bus.crowdLevel)}
                  </span>
                </div>

                <div className="stop-bus-timing">
                  <div className="timing-row">
                    <div className="timing-item">
                      <Clock size={18} className="timing-icon" />
                      <span className="timing-label">Arriving in</span>
                    </div>
                    <span className="timing-value primary">{bus.etaToStop} min</span>
                  </div>

                  <div className="timing-row">
                    <span className="timing-label">Expected at</span>
                    <span className="timing-value">{getExpectedTime(bus.etaToStop)}</span>
                  </div>

                  <div className="prediction-confidence">
                    <span className="prediction-label">Current Occupancy</span>
                    <span 
                      className="prediction-value" 
                      style={{ 
                        color: getOccupancyColor(currentOccupancy),
                        fontWeight: 'bold'
                      }}
                    >
                      {currentOccupancy}%
                    </span>
                  </div>
                  <div className="prediction-bar">
                    <div 
                      className="prediction-fill" 
                      style={{ 
                        width: `${currentOccupancy}%`,
                        background: getOccupancyGradient(currentOccupancy)
                      }}
                    ></div>
                  </div>

                  {nextBus && (
                    <div className="next-bus-info">
                      <div className="timing-row">
                        <span className="timing-label">Next {bus.route} Bus</span>
                        <span className="timing-value">
                          {nextBus.etaToStop} min{' '}
                          <span style={{ 
                            color: getOccupancyColor(getOccupancyPercent(nextBus)),
                            fontWeight: 'bold'
                          }}>
                            ({getOccupancyPercent(nextBus)}%)
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FindMyStop;

