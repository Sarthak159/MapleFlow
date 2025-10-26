// BusContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import weeklyDataService from "../services/weeklyDataService";

const BusContext = createContext();

export const useBus = () => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error("useBus must be used within a BusProvider");
  }
  return context;
};

export const BusProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [stops, setStops] = useState([
    { id: "arps-hall", name: "Arps Hall", location: { lat: 40.0050, lng: -83.0300 }, isFavorite: true },
    { id: "11th-worthington", name: "11th and Worthington", location: { lat: 40.0065, lng: -83.0285 }, isFavorite: false },
    { id: "blackburn-house", name: "Blackburn House", location: { lat: 40.0020, lng: -83.0180 }, isFavorite: false },
    { id: "brain-spine-hospital", name: "Brain and Spine Hospital", location: { lat: 40.0000, lng: -83.0100 }, isFavorite: false },
    { id: "gray", name: "Gray", location: { lat: 39.9995, lng: -83.0145 }, isFavorite: false },
    { id: "herrick-transit-hub", name: "Herrick Transit Hub", location: { lat: 40.0030, lng: -83.0220 }, isFavorite: true },
    { id: "mack-hall", name: "Mack Hall", location: { lat: 40.0045, lng: -83.0255 }, isFavorite: false },
    { id: "mason-hall", name: "Mason Hall", location: { lat: 40.0010, lng: -83.0165 }, isFavorite: false },
    { id: "ohio-union", name: "Ohio Union", location: { lat: 40.0025, lng: -83.0195 }, isFavorite: true },
    { id: "ross-heart-hospital", name: "Ross Heart Hospital", location: { lat: 39.9985, lng: -83.0125 }, isFavorite: false },
    { id: "scarlet", name: "Scarlet", location: { lat: 40.0055, lng: -83.0275 }, isFavorite: false },
    { id: "siebert-hall", name: "Siebert Hall", location: { lat: 40.0040, lng: -83.0240 }, isFavorite: false },
    { id: "st-john-arena", name: "St. John Arena (Westbound)", location: { lat: 40.0070, lng: -83.0310 }, isFavorite: false },
    { id: "james-cancer-hospital", name: "The James Cancer Hospital", location: { lat: 39.9980, lng: -83.0110 }, isFavorite: false },
    { id: "university-hospital", name: "University Hospital", location: { lat: 39.9975, lng: -83.0095 }, isFavorite: false }
  ]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("ws://localhost:3001");
    setSocket(newSocket);

    // Listen for real-time bus updates
    newSocket.on("busUpdate", (busData) => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus.id === busData.id ? { ...bus, ...busData } : bus
        )
      );
    });

    // Load initial bus data
    loadInitialData();

    return () => {
      newSocket.close();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      // Load weekly template data
      await weeklyDataService.loadData();
      
      // Convert weekly data to bus objects (ignores day_of_week column)
      const buses = weeklyDataService.convertToBusObjects();
      
      setBuses(buses);
      setLoading(false);
    } catch (error) {
      console.error("Error loading bus data:", error);
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      // Convert weekly data to bus objects with current time (ignores day_of_week)
      const buses = weeklyDataService.convertToBusObjects();
      setBuses(buses);
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing bus data:", error);
      setLoading(false);
    }
  };

  const updateCrowdLevel = (busId, level) => {
    setBuses((prevBuses) =>
      prevBuses.map((bus) =>
        bus.id === busId ? { ...bus, crowdLevel: level } : bus
      )
    );

    // Send update to server
    if (socket) {
      socket.emit("crowdUpdate", { busId, level });
    }
  };

  const getCrowdEmoji = (level) => {
    switch (level) {
      case "low":
        return "🟢";
      case "medium":
        return "🟡";
      case "high":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getCrowdText = (level) => {
    switch (level) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return "Unknown";
    }
  };

  const getComfortColor = (score) => {
    if (score >= 8) return "#28a745";
    if (score >= 6) return "#ffc107";
    return "#dc3545";
  };

  const getRecommendation = (bus) => {
    const { eta, nextEta, crowdLevel, comfortScore } = bus;
    const timeDifference = nextEta - eta;

    if (crowdLevel === "low" && timeDifference <= 5) {
      return `Recommended: Wait ${timeDifference} more minutes for a less crowded bus`;
    } else if (crowdLevel === "high" && timeDifference <= 3) {
      return `Consider waiting for the next bus (${timeDifference} min later) for better comfort`;
    } else if (comfortScore >= 8) {
      return `Great choice! This bus offers excellent comfort`;
    } else {
      return `Arriving soon - moderate comfort level`;
    }
  };

  const toggleFavoriteStop = (stopId) => {
    setStops(prevStops =>
      prevStops.map(stop =>
        stop.id === stopId ? { ...stop, isFavorite: !stop.isFavorite } : stop
      )
    );
  };

  const value = {
    buses,
    loading,
    stops,
    refreshData,
    updateCrowdLevel,
    getCrowdEmoji,
    getCrowdText,
    getComfortColor,
    getRecommendation,
    toggleFavoriteStop,
  };

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
  
};
