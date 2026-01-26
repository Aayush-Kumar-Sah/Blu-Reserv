import React, { useState } from 'react';
import ManagerBookingList from './ManagerBookingList';
import ManagerBookingCalendar from './ManagerBookingCalendar';
import MaintenanceManager from './MaintenanceManager';
import ManagerStatistics from './ManagerStatistics';

const ManagerDashboard = () => {
  const [activeView, setActiveView] = useState('list');

  return (
    <>
      <div className="nav">
        <button
          className={`nav-button ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          All Bookings
        </button>
        <button
          className={`nav-button ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          Calendar View
        </button>
        <button
          className={`nav-button ${activeView === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveView('statistics')}
        >
          📊 Statistics
        </button>
        <button
          className={`nav-button ${activeView === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveView('maintenance')}
        >
          🔧 Maintenance
        </button>
      </div>

      {activeView === 'list' && <ManagerBookingList />}
      {activeView === 'calendar' && <ManagerBookingCalendar />}
      {activeView === 'statistics' && <ManagerStatistics />}
      {activeView === 'maintenance' && <MaintenanceManager />}
    </>
  );
};

export default ManagerDashboard;
