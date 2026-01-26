import React, { useState } from 'react';
import BookingList from './BookingList';
import BookingCalendar from './BookingCalendar';
import AdminStatistics from './AdminStatistics';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('statistics');

  return (
    <div>
      <div className="nav">
        <button
          className={`nav-button ${activeView === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveView('statistics')}
        >
          📊 Statistics
        </button>
        <button
          className={`nav-button ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          📅 Calendar View
        </button>
        <button
          className={`nav-button ${activeView === 'all-bookings' ? 'active' : ''}`}
          onClick={() => setActiveView('all-bookings')}
        >
          📋 All Bookings
        </button>
      </div>

      {activeView === 'statistics' && <AdminStatistics />}
      {activeView === 'calendar' && <BookingCalendar />}
      {activeView === 'all-bookings' && <BookingList />}
    </div>
  );
};

export default AdminDashboard;
