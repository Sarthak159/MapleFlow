import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import FindMyStop from './components/FindMyStop';
import Analytics from './components/Analytics';
import Feedback from './components/Feedback';
import Sidebar from './components/Sidebar';
import { BusProvider } from './context/BusContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <BusProvider>
      <NotificationProvider>
        <Router>
          <div className="app-buckeyeride">
            <Sidebar />
            <main className="main-content-buckeyeride">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/stops" element={<FindMyStop />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/feedback" element={<Feedback />} />
              </Routes>
            </main>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </NotificationProvider>
    </BusProvider>
  );
}

export default App;




