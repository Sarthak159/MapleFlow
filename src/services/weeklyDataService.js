// Weekly Data Service for OSU CABS Traffic Data
// This service ignores the day_of_week column and uses real-time day and time
import Papa from 'papaparse';

class WeeklyDataService {
  constructor() {
    this.data = null;
    this.loaded = false;
  }

  async loadData() {
    if (this.loaded) return this.data;

    try {
      const response = await fetch('/osu_cabs_people_traffic_weekly_template.csv');
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            this.data = results.data;
            this.loaded = true;
            resolve(this.data);
          },
          error: (error) => {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error loading weekly CSV data:', error);
      throw error;
    }
  }

  // Get current time predictions for a specific stop (ignores day_of_week column)
  getCurrentPredictions(stopName, currentTime = null) {
    if (!this.data) return [];

    const now = currentTime || new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Find predictions for current time (ignoring day_of_week)
    const predictions = this.data.filter(row => 
      row.time === currentTimeString &&
      row.bus_stop === stopName
    );

    return predictions;
  }

  // Get all unique stops
  getUniqueStops() {
    if (!this.data) return [];
    
    const stops = [...new Set(this.data.map(row => row.bus_stop))];
    return stops.map(stop => ({
      name: stop,
      id: stop.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }));
  }

  // Get all unique routes
  getUniqueRoutes() {
    if (!this.data) return [];
    
    const routes = [...new Set(this.data.map(row => row.route))];
    return routes;
  }

  // Get predictions for a specific route (ignores day_of_week)
  getRoutePredictions(routeName, currentTime = null) {
    if (!this.data) return [];

    const now = currentTime || new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Find predictions for current time (ignoring day_of_week)
    const predictions = this.data.filter(row => 
      row.time === currentTimeString &&
      row.route === routeName
    );

    return predictions;
  }

  // Get next time slot predictions (for nextEta) - ignores day_of_week
  getNextTimeSlotPredictions(routeName, currentTime = null) {
    if (!this.data) return [];

    const now = currentTime || new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Calculate next time slot (assuming 10-minute intervals)
    const nextMinute = currentMinute + 10;
    const nextHour = nextMinute >= 60 ? currentHour + 1 : currentHour;
    const finalMinute = nextMinute >= 60 ? nextMinute - 60 : nextMinute;
    const nextTimeString = `${nextHour.toString().padStart(2, '0')}:${finalMinute.toString().padStart(2, '0')}`;

    const predictions = this.data.filter(row => 
      row.time === nextTimeString &&
      row.route === routeName
    );

    return predictions;
  }

  // Convert CSV data to bus objects for the app (ignores day_of_week)
  convertToBusObjects(currentTime = null) {
    if (!this.data) return [];

    const now = currentTime || new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Get current predictions (ignoring day_of_week)
    const currentPredictions = this.data.filter(row => 
      row.time === currentTimeString
    );

    // Get next time slot predictions
    const nextMinute = currentMinute + 10;
    const nextHour = nextMinute >= 60 ? currentHour + 1 : currentHour;
    const finalMinute = nextMinute >= 60 ? nextMinute - 60 : nextMinute;
    const nextTimeString = `${nextHour.toString().padStart(2, '0')}:${finalMinute.toString().padStart(2, '0')}`;

    const nextPredictions = this.data.filter(row => 
      row.time === nextTimeString
    );

    // Group by route and create bus objects
    const routeGroups = {};
    currentPredictions.forEach(prediction => {
      const route = prediction.route;
      if (!routeGroups[route]) {
        routeGroups[route] = {
          current: [],
          next: []
        };
      }
      routeGroups[route].current.push(prediction);
    });

    nextPredictions.forEach(prediction => {
      const route = prediction.route;
      if (routeGroups[route]) {
        routeGroups[route].next.push(prediction);
      }
    });

    // Convert to bus objects
    const buses = [];
    let busIdCounter = 1;

    Object.keys(routeGroups).forEach(route => {
      const routeData = routeGroups[route];
      const currentStops = routeData.current;
      const nextStops = routeData.next;

      // Create a bus for each stop with current predictions
      currentStops.forEach((prediction, index) => {
        const busLoad = parseFloat(prediction.predicted_bus_load);
        const waitTime = parseFloat(prediction.wait_time_min);
        
        // Determine crowd level based on bus load
        let crowdLevel = 'low';
        if (busLoad >= 0.8) crowdLevel = 'high';
        else if (busLoad >= 0.5) crowdLevel = 'medium';

        // Calculate comfort score based on load and wait time
        const comfortScore = Math.max(1, Math.min(10, 10 - (busLoad * 5) - (waitTime / 10)));

        // Find corresponding next prediction for this stop
        const nextPrediction = nextStops.find(p => p.bus_stop === prediction.bus_stop);
        const nextEta = nextPrediction ? parseFloat(nextPrediction.wait_time_min) : waitTime + 10;

        const bus = {
          id: `${route}-${busIdCounter++}`,
          route: route,
          destination: route,
          eta: waitTime,
          nextEta: nextEta,
          crowdLevel: crowdLevel,
          comfortScore: Math.round(comfortScore * 10) / 10,
          temperature: 70 + Math.random() * 10, // Random temperature
          smoothness: Math.max(5, 10 - (busLoad * 3)), // Higher load = less smooth
          passengerCount: Math.round(busLoad * 50), // Assuming 50 capacity
          capacity: 50,
          isEcoMode: Math.random() > 0.5, // Random eco mode
          co2Saved: Math.round(Math.random() * 25),
          location: this.getStopLocation(prediction.bus_stop),
          heading: Math.random() * 360,
          currentStop: prediction.bus_stop,
          nextStops: this.getNextStopsForRoute(route, prediction.bus_stop),
          predictedLoad: busLoad,
          waitTime: waitTime
        };

        buses.push(bus);
      });
    });

    return buses;
  }

  // Get location for a stop (you may need to update these coordinates)
  getStopLocation(stopName) {
    const stopLocations = {
      'Mount Hall (WB)': { lat: 40.0050, lng: -83.0300 },
      'Carmack 5 (NB)': { lat: 40.0065, lng: -83.0285 },
      'Carmack 5 (SB)': { lat: 40.0065, lng: -83.0285 },
      'Research Center (SB)': { lat: 40.0000, lng: -83.0100 },
      'Kinnear Rd Lot (EB)': { lat: 40.0070, lng: -83.0310 },
      'Blankenship Hall (EB)': { lat: 40.0040, lng: -83.0240 },
      'Midwest Campus (EB)': { lat: 40.0030, lng: -83.0220 },
      'St. John Arena (EB)': { lat: 40.0070, lng: -83.0310 },
      'Fontana Lab (EB)': { lat: 40.0020, lng: -83.0180 },
      'Stillman Hall (SB)': { lat: 40.0010, lng: -83.0165 },
      'Ohio Union (SB)': { lat: 40.0025, lng: -83.0195 },
      'Ohio Union (NB)': { lat: 40.0025, lng: -83.0195 },
      'Siebert Hall (WB)': { lat: 40.0040, lng: -83.0240 },
      'Mack Hall (NB)': { lat: 40.0045, lng: -83.0255 },
      'Herrick Drive Transit Hub (NB)': { lat: 40.0030, lng: -83.0220 },
      '11th & Worthington (EB)': { lat: 40.0065, lng: -83.0285 },
      'Arps Hall (NB)': { lat: 40.0050, lng: -83.0300 },
      'Blackburn House (WB)': { lat: 40.0020, lng: -83.0180 },
      'Mason Hall (WB)': { lat: 40.0010, lng: -83.0165 }
    };

    return stopLocations[stopName] || { lat: 40.0025, lng: -83.0195 }; // Default to Ohio Union
  }

  // Get next stops for a route (simplified)
  getNextStopsForRoute(route, currentStop) {
    // This is a simplified implementation
    // In a real app, you'd have the actual route sequence
    const allStops = this.getUniqueStops();
    const currentIndex = allStops.findIndex(stop => stop.name === currentStop);
    
    return allStops.slice(currentIndex + 1, currentIndex + 4).map(stop => ({
      name: stop.name,
      eta: Math.random() * 10 + 5 // Random ETA
    }));
  }

  // Get data statistics
  getDataStats() {
    if (!this.data) return { totalRecords: 0, uniqueStops: 0, uniqueRoutes: 0 };
    
    return {
      totalRecords: this.data.length,
      uniqueStops: this.getUniqueStops().length,
      uniqueRoutes: this.getUniqueRoutes().length,
      timeRange: 'Weekly template - real-time predictions'
    };
  }
}

export default new WeeklyDataService();
