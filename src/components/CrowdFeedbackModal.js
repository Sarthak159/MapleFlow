// CrowdFeedbackModal.js - MapleFlow Design
import React, { useState } from "react";
import { useBus } from "../context/BusContext";
import { X, Users } from "lucide-react";
import toast from "react-hot-toast";

const CrowdFeedbackModal = ({ bus, onClose }) => {
  const { updateCrowdLevel } = useBus();
  const [selectedLevel, setSelectedLevel] = useState(bus.crowdLevel);
  const [submitting, setSubmitting] = useState(false);

  const crowdLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Moderate" },
    { value: "high", label: "Crowded" },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateCrowdLevel(bus.id, selectedLevel);
      toast.success("Thank you for your feedback! Crowd level updated.");
      onClose();
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate comfort score circle
  const comfortScore = bus.comfortScore || 7.5;
  const circumference = 2 * Math.PI * 45;
  const progress = (comfortScore / 10) * circumference;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-mapleflow" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn-modal">
          <X size={24} />
        </button>

        <div className="modal-header-mapleflow">
          <h2>Bus {bus.route} - {bus.destination}</h2>
        </div>

        <div className="modal-body-mapleflow">
          {/* Arriving Info and Comfort Score */}
          <div className="modal-top-section">
            <div className="arriving-info">
              <div className="arriving-label">Arriving in</div>
              <div className="arriving-time">{bus.eta} min</div>
            </div>
            
            <div className="comfort-score-circle">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="comfort-score-value">
                <div className="score-number">{comfortScore}</div>
                <div className="score-label">Comfort Score</div>
              </div>
            </div>
          </div>

          {/* Crowd Feedback */}
          <div className="crowd-feedback-section">
            <div className="crowd-feedback-title">
              <Users size={18} />
              <span>How crowded is Bus {bus.route}?</span>
            </div>
            
            <div className="crowd-buttons">
              {crowdLevels.map((level) => (
                <button
                  key={level.value}
                  className={`crowd-btn ${selectedLevel === level.value ? 'selected' : ''}`}
                  onClick={() => setSelectedLevel(level.value)}
                >
                  {level.label}
                </button>
              ))}
            </div>
            
            <button 
              className="submit-report-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>

          {/* Next Stops */}
          <div className="next-stops-section">
            <h3>Next Stops</h3>
            <div className="stops-list">
              {bus.nextStops && bus.nextStops.map((stop, index) => (
                <div key={index} className="stop-item">
                  <span className="stop-name">{stop.name}</span>
                  <span className="stop-eta">{stop.eta} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdFeedbackModal;
