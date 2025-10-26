// Analytics.js
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, Users, Clock, MapPin, BarChart3, Activity } from "lucide-react";
import { useBus } from "../context/BusContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { buses, stops } = useBus();
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  // Calculate real-time statistics
  const totalPassengers = buses.reduce((sum, bus) => sum + bus.passengerCount, 0);
  const avgOccupancy = Math.round(
    buses.reduce((sum, bus) => sum + (bus.passengerCount / bus.capacity) * 100, 0) / buses.length
  );
  const avgComfort = (buses.reduce((sum, bus) => sum + bus.comfortScore, 0) / buses.length).toFixed(1);
  
  // Top 5 busiest stops by bus count (varies by timeframe)
  const getStopData = () => {
    if (selectedTimeframe === 'day') {
      return [
        { name: "Ohio Union", count: 52 },
        { name: "Herrick Transit Hub", count: 48 },
        { name: "Arps Hall", count: 42 },
        { name: "Mack Hall", count: 35 },
        { name: "Scarlet", count: 30 },
      ];
    } else if (selectedTimeframe === 'week') {
      return [
        { name: "Ohio Union", count: 364 },
        { name: "Herrick Transit Hub", count: 336 },
        { name: "Arps Hall", count: 294 },
        { name: "Mack Hall", count: 245 },
        { name: "Scarlet", count: 210 },
      ];
    } else { // month
      return [
        { name: "Ohio Union", count: 1560 },
        { name: "Herrick Transit Hub", count: 1440 },
        { name: "Arps Hall", count: 1260 },
        { name: "Mack Hall", count: 1050 },
        { name: "Scarlet", count: 900 },
      ];
    }
  };

  const topStops = getStopData();

  const stopAnalytics = {
    labels: topStops.map(stop => stop.name),
    datasets: [
      {
        label: "Average Passengers/Hour",
        data: topStops.map(stop => stop.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(251, 146, 60, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const getPeakHoursData = () => {
    if (selectedTimeframe === 'day') {
      return {
        labels: ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
        data: [15, 45, 68, 35, 42, 62, 38, 22],
      };
    } else if (selectedTimeframe === 'week') {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [280, 320, 340, 335, 310, 180, 150],
      };
    } else { // month
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [1200, 1350, 1280, 1150],
      };
    }
  };

  const peakHoursInfo = getPeakHoursData();

  const peakHoursData = {
    labels: peakHoursInfo.labels,
    datasets: [
      {
        label: "Passenger Count",
        data: peakHoursInfo.data,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Calculate crowd (total passengers) by route
  const crowdByRoute = buses.reduce((acc, bus) => {
    if (!acc[bus.route]) {
      acc[bus.route] = 0;
    }
    acc[bus.route] += bus.passengerCount;
    return acc;
  }, {});

  const routeDistribution = {
    labels: ["CC", "BE", "CLS", "ER", "MC", "NWC", "WMC"],
    datasets: [
      {
        data: [
          crowdByRoute["CC"] || 0,
          crowdByRoute["BE"] || 0,
          crowdByRoute["CLS"] || 0,
          crowdByRoute["ER"] || 0,
          crowdByRoute["MC"] || 0,
          crowdByRoute["NWC"] || 0,
          crowdByRoute["WMC"] || 0,
        ],
        backgroundColor: [
          "rgba(220, 38, 38, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(6, 182, 212, 0.8)",
        ],
        borderColor: [
          "rgba(220, 38, 38, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(6, 182, 212, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 15,
          font: {
            size: 13,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} passengers (${percentage}%)`;
          }
        }
      },
    },
  };

  const insights = [
    {
      icon: <TrendingUp size={24} />,
      title: "Peak Usage Time",
      value: "10:00-11:00 AM",
      description: "Highest passenger volume during class changes",
      color: "blue",
    },
    {
      icon: <Users size={24} />,
      title: "Busiest Stop",
      value: "Ohio Union",
      description: "52 passengers/hour average",
      color: "purple",
    },
    {
      icon: <Clock size={24} />,
      title: "Avg Wait Time",
      value: "5.2 minutes",
      description: "Average across all routes",
      color: "green",
    },
    {
      icon: <Activity size={24} />,
      title: "System Efficiency",
      value: `${avgOccupancy}%`,
      description: "Average bus occupancy rate",
      color: "orange",
    },
  ];

  return (
    <div className="analytics-buckeyeride">
      {/* Header */}
      <div className="analytics-header-buckeyeride">
        <div className="analytics-title-section">
          <div className="analytics-icon-title">
            <BarChart3 size={32} />
            <div>
              <h1>Analytics Dashboard</h1>
              <p>Real-time insights and performance metrics</p>
            </div>
          </div>
        </div>
        
        <div className="timeframe-selector-buckeyeride">
          <button
            className={selectedTimeframe === "day" ? "active" : ""}
            onClick={() => setSelectedTimeframe("day")}
          >
            Day
          </button>
          <button
            className={selectedTimeframe === "week" ? "active" : ""}
            onClick={() => setSelectedTimeframe("week")}
          >
            Week
          </button>
          <button
            className={selectedTimeframe === "month" ? "active" : ""}
            onClick={() => setSelectedTimeframe("month")}
          >
            Month
          </button>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="insights-grid-buckeyeride">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-card-buckeyeride ${insight.color}`}>
            <div className="insight-icon-buckeyeride">{insight.icon}</div>
            <div className="insight-content-buckeyeride">
              <h3>{insight.title}</h3>
              <div className="insight-value-buckeyeride">{insight.value}</div>
              <p>{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid-buckeyeride">
        {/* Bar Chart - Stop Analytics */}
        <div className="chart-card-buckeyeride large">
          <div className="chart-header-buckeyeride">
            <h3>Busiest Stops</h3>
            <p>
              {selectedTimeframe === 'day' && 'Passengers today'}
              {selectedTimeframe === 'week' && 'Passengers this week'}
              {selectedTimeframe === 'month' && 'Passengers this month'}
            </p>
          </div>
          <div className="chart-container-buckeyeride">
            <Bar data={stopAnalytics} options={chartOptions} />
          </div>
        </div>

        {/* Line Chart - Peak Hours */}
        <div className="chart-card-buckeyeride large">
          <div className="chart-header-buckeyeride">
            <h3>
              {selectedTimeframe === 'day' && 'Peak Hours Analysis'}
              {selectedTimeframe === 'week' && 'Weekly Traffic Pattern'}
              {selectedTimeframe === 'month' && 'Monthly Trend'}
            </h3>
            <p>
              {selectedTimeframe === 'day' && 'Passenger volume throughout the day'}
              {selectedTimeframe === 'week' && 'Passenger volume by day of week'}
              {selectedTimeframe === 'month' && 'Passenger volume by week'}
            </p>
          </div>
          <div className="chart-container-buckeyeride">
            <Line data={peakHoursData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Crowd by Route */}
        <div className="chart-card-buckeyeride">
          <div className="chart-header-buckeyeride">
            <h3>Crowd by Route</h3>
            <p>Total passengers per route</p>
          </div>
          <div className="chart-container-buckeyeride doughnut">
            <Doughnut data={routeDistribution} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
