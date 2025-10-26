// EcoModeDisplay.js
import React from "react";
import { useBus } from "../context/BusContext";
import { Leaf, Zap } from "lucide-react";

const EcoModeDisplay = () => {
  const { buses } = useBus();

  const ecoBuses = buses.filter((bus) => bus.isEcoMode);
  const totalCo2Saved = buses.reduce((total, bus) => total + bus.co2Saved, 0);
  const weeklyCo2Saved = totalCo2Saved * 7; // Simulate weekly savings

  if (ecoBuses.length === 0 && totalCo2Saved === 0) {
    return null;
  }

  return (
    <div className="eco-mode">
      <div className="eco-header">
        <Leaf size={24} />
        <h3>Eco Mode Active</h3>
      </div>

      <div className="eco-stats">
        <div className="eco-stat">
          <Zap size={20} />
          <span>{ecoBuses.length} buses in eco mode</span>
        </div>

        <div className="eco-impact">
          SmartBus+ saved {weeklyCo2Saved} lbs of CO₂ this week by adjusting bus
          intervals
        </div>

        <div className="eco-description">
          Energy-saving schedules active during low-traffic periods
        </div>
      </div>
    </div>
  );
};

export default EcoModeDisplay;
