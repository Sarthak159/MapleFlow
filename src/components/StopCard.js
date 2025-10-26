// StopCard.js - MapleFlow Design
import React from 'react';
import { MapPin, Star } from 'lucide-react';
import BusCard from './BusCard';

const StopCard = ({ stop, buses, onBusClick }) => {
  // Filter buses for this stop
  const stopBuses = buses.filter(bus => 
    bus.currentStop === stop.name || 
    (bus.nextStops && bus.nextStops.some(s => s.name === stop.name))
  );

  if (stopBuses.length === 0) return null;

  return (
    <div className="stop-card">
      <div className="stop-header">
        <div className="stop-header-left">
          <MapPin size={18} className="stop-icon" />
          <h3 className="stop-name">{stop.name}</h3>
        </div>
        {stop.isFavorite && <Star size={18} fill="#f59e0b" color="#f59e0b" />}
      </div>
      
      <div className="stop-buses">
        {stopBuses.map((bus) => (
          <BusCard 
            key={bus.id} 
            bus={bus} 
            onClick={onBusClick}
          />
        ))}
      </div>
    </div>
  );
};

export default StopCard;

