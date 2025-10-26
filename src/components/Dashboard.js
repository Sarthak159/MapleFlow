// Dashboard.js - MapleFlow Design
import React, { useState, useEffect } from "react";
import { useBus } from "../context/BusContext";
import BusCard from "./BusCard.js";
import MapView from "./MapView.js";
import CrowdFeedbackModal from "./CrowdFeedbackModal";
import DataInfo from "./DataInfo.js";
import { Users, TrendingUp, RefreshCw, Clock } from "lucide-react";

const Dashboard = () => {
  const { buses, loading, refreshData } = useBus();
  const [selectedBus, setSelectedBus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
  };

  const closeFeedbackModal = () => {
    setSelectedBus(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Sort buses by ETA (lowest time first)
  const sortedBuses = [...buses].sort((a, b) => a.eta - b.eta);

  // Helper function to find next bus of the same route
  const getNextBusInfo = (currentBus) => {
    const samRouteBuses = sortedBuses
      .filter(bus => bus.route === currentBus.route && bus.eta > currentBus.eta)
      .sort((a, b) => a.eta - b.eta);
    
    return samRouteBuses.length > 0 ? samRouteBuses[0] : null;
  };

  // Calculate stats
  const activeBuses = buses.length;
  const avgOccupancy = Math.round(
    buses.reduce((sum, bus) => sum + (bus.passengerCount / bus.capacity) * 100, 0) / buses.length
  );
  const avgComfort = (buses.reduce((sum, bus) => sum + bus.comfortScore, 0) / buses.length).toFixed(1);

  if (loading) {
    return (
      <div className="dashboard-buckeyeride">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading MapleFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-buckeyeride">
      {/* Dashboard Header */}
      <div className="dashboard-top-header">
        <div className="header-content">
          <h1 className="dashboard-title">Live Transit Comfort</h1>
          <p className="dashboard-subtitle">Real-Time bus tracking with crowd intelligence</p>
        </div>
        <div className="header-right">
          <div className="live-time-display">
            <Clock size={16} />
            <div className="time-info">
              <div className="current-time">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="current-day">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3 className="stat-label">Active Buses</h3>
            <p className="stat-value">{activeBuses}</p>
          </div>
          <div className="stat-icon bus-icon">
            <Users size={32} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3 className="stat-label">Avg. Occupancy</h3>
            <p className="stat-value">{avgOccupancy}%</p>
          </div>
          <div className="stat-icon passengers-icon">
            <Users size={32} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3 className="stat-label">Avg Comfort</h3>
            <p className="stat-value">{avgComfort}/10</p>
          </div>
          <div className="stat-icon comfort-icon">
            <TrendingUp size={32} />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="dashboard-map-section">
        <MapView />
      </div>

      {/* Data Info Section */}
      <div className="data-info-section">
        <DataInfo />
      </div>

      {/* Bus Cards Grid */}
      <div className="bus-cards-grid">
        {sortedBuses.map((bus) => (
          <BusCard 
            key={bus.id} 
            bus={bus}
            nextBus={getNextBusInfo(bus)}
            onClick={handleBusClick}
          />
        ))}
      </div>

      {/* Crowd Feedback Modal */}
      {selectedBus && (
        <CrowdFeedbackModal bus={selectedBus} onClose={closeFeedbackModal} />
      )}
    </div>
  );
};

export default Dashboard;
