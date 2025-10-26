import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBus } from '../context/BusContext';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom bus marker icons based on crowd level
const createBusIcon = (route, crowdLevel) => {
  const colorMap = {
    low: '#10b981',    // green
    medium: '#f59e0b', // yellow
    high: '#ef4444'    // red
  };
  
  const color = colorMap[crowdLevel] || '#6366f1';
  
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${route}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to auto-fit bounds
const MapBounds = ({ buses }) => {
  const map = useMap();
  
  useEffect(() => {
    if (buses && buses.length > 0) {
      const bounds = buses.map(bus => [bus.location.lat, bus.location.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [buses, map]);
  
  return null;
};

const MapView = () => {
  const { buses, stops } = useBus();
  
  // Default center (Columbus, OH area)
  const defaultCenter = [40.0020, -83.0200];
  
  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ height: '100%', width: '100%', borderRadius: '0' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds buses={buses} />
        
        {/* Bus Markers */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.location.lat, bus.location.lng]}
            icon={createBusIcon(bus.route, bus.crowdLevel)}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '150px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                  {bus.route} - {bus.destination}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: 'bold', color: '#6366f1' }}>
                  {bus.eta} min
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', textTransform: 'capitalize' }}>
                  {bus.crowdLevel} crowding
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Stop Markers */}
        {stops && stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.location.lat, stop.location.lng]}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 4px 0' }}>{stop.name}</h4>
                {stop.isFavorite && <span>⭐</span>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;

