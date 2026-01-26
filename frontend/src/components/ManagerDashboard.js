import React, { useState } from 'react';
import ManagerBookingList from './ManagerBookingList';
import ManagerBookingCalendar from './ManagerBookingCalendar';

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
      </div>

      {activeView === 'list' && <ManagerBookingList />}
      {activeView === 'calendar' && <ManagerBookingCalendar />}
    </>
  );
};

export default ManagerDashboard;
