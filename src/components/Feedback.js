// Feedback.js - Simplified MapleFlow Design
import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { useBus } from "../context/BusContext";
import toast from "react-hot-toast";

const Feedback = () => {
  const { buses, updateCrowdLevel } = useBus();
  const [formData, setFormData] = useState({
    busId: "",
    tripRating: 0,
    crowdLevel: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Group buses by route for better organization
  const groupedBuses = buses.reduce((acc, bus) => {
    if (!acc[bus.route]) {
      acc[bus.route] = [];
    }
    acc[bus.route].push(bus);
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.busId || !formData.tripRating || !formData.crowdLevel) {
      toast.error("Please fill out all fields");
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call and update crowd level
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update the crowd level for the selected bus
      updateCrowdLevel(formData.busId, formData.crowdLevel);

      toast.success("Thank you for your feedback! It helps us improve the service.");

      // Reset form
      setFormData({
        busId: "",
        tripRating: 0,
        crowdLevel: "",
      });
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page-mapleflow">
      <div className="feedback-header-mapleflow">
        <h1>Trip Feedback</h1>
        <p>Help us improve your bus experience by sharing your feedback</p>
      </div>

      <form className="feedback-form-mapleflow" onSubmit={handleSubmit}>
        {/* Bus Selection */}
        <div className="form-group-mapleflow">
          <label className="form-label-mapleflow">Which bus did you ride?</label>
          <select
            name="busId"
            value={formData.busId}
            onChange={(e) => setFormData({...formData, busId: e.target.value})}
            className="form-select-mapleflow"
            required
          >
            <option value="">Select a bus</option>
            {Object.entries(groupedBuses).map(([route, buses]) => (
              <optgroup key={route} label={`${route} - ${buses[0].destination}`}>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.id}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Overall Trip Rating */}
        <div className="form-group-mapleflow">
          <label className="form-label-mapleflow">
            How would you rate your overall trip?
          </label>
          <div className="star-rating-mapleflow">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn-mapleflow ${star <= formData.tripRating ? "active" : ""}`}
                onClick={() => setFormData({...formData, tripRating: star})}
              >
                <Star size={32} fill={star <= formData.tripRating ? "#fbbf24" : "none"} 
                      stroke={star <= formData.tripRating ? "#fbbf24" : "#d1d5db"} />
              </button>
            ))}
          </div>
          <div className="rating-text-mapleflow">
            {formData.tripRating === 0 ? "Select a rating" :
             formData.tripRating === 1 ? "Poor" :
             formData.tripRating === 2 ? "Fair" :
             formData.tripRating === 3 ? "Good" :
             formData.tripRating === 4 ? "Very Good" : "Excellent"}
          </div>
        </div>

        {/* Crowding Level - 3 Options */}
        <div className="form-group-mapleflow">
          <label className="form-label-mapleflow">How crowded was the bus?</label>
          <div className="crowd-options-mapleflow">
            <button
              type="button"
              className={`crowd-option-btn ${formData.crowdLevel === 'low' ? 'selected low' : ''}`}
              onClick={() => setFormData({...formData, crowdLevel: 'low'})}
            >
              <div className="crowd-emoji">🟢</div>
              <div className="crowd-label">Low</div>
              <div className="crowd-desc">Plenty of seats</div>
            </button>
            
            <button
              type="button"
              className={`crowd-option-btn ${formData.crowdLevel === 'medium' ? 'selected medium' : ''}`}
              onClick={() => setFormData({...formData, crowdLevel: 'medium'})}
            >
              <div className="crowd-emoji">🟡</div>
              <div className="crowd-label">Medium</div>
              <div className="crowd-desc">Some standing</div>
            </button>
            
            <button
              type="button"
              className={`crowd-option-btn ${formData.crowdLevel === 'high' ? 'selected high' : ''}`}
              onClick={() => setFormData({...formData, crowdLevel: 'high'})}
            >
              <div className="crowd-emoji">🔴</div>
              <div className="crowd-label">High</div>
              <div className="crowd-desc">Very crowded</div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn-mapleflow" disabled={submitting}>
          <Send size={20} />
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
