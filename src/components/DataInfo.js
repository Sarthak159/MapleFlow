// DataInfo.js - Component to display information about the data source
import React, { useState, useEffect } from 'react';
import { Database, Clock, MapPin } from 'lucide-react';
import weeklyDataService from '../services/weeklyDataService';

const DataInfo = () => {
  const [dataStats, setDataStats] = useState({
    totalRecords: 0,
    uniqueStops: 0,
    uniqueRoutes: 0,
    timeRange: ''
  });

  useEffect(() => {
    const loadDataStats = async () => {
      try {
        await weeklyDataService.loadData();
        const stats = weeklyDataService.getDataStats();
        
        setDataStats({
          totalRecords: stats.totalRecords,
          uniqueStops: stats.uniqueStops,
          uniqueRoutes: stats.uniqueRoutes,
          timeRange: stats.timeRange
        });
      } catch (error) {
        console.error('Error loading data stats:', error);
      }
    };

    loadDataStats();
  }, []);

  return (
    <div className="data-info-card">
      <div className="data-info-header">
        <Database size={20} />
        <h3>Data Source</h3>
      </div>
      <div className="data-info-content">
        <p className="data-source">OSU CABS Weekly Template (Real-time)</p>
        <div className="data-stats">
          <div className="stat-item">
            <Clock size={16} />
            <span>{dataStats.timeRange}</span>
          </div>
          <div className="stat-item">
            <MapPin size={16} />
            <span>{dataStats.uniqueStops} stops</span>
          </div>
          <div className="stat-item">
            <Database size={16} />
            <span>{dataStats.totalRecords.toLocaleString()} records</span>
          </div>
        </div>
        <p className="data-description">
          Real-time predictions using current day and time, ignoring CSV day column
        </p>
      </div>
    </div>
  );
};

export default DataInfo;
