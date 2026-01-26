import React, { useState } from 'react';
import BookingForm from './BookingForm';
import UserBookingList from './UserBookingList';
import UserBookingCalendar from './UserBookingCalendar';

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('form');

  return (
    <>
      <div className="nav">
        <button
          className={`nav-button ${activeView === 'form' ? 'active' : ''}`}
          onClick={() => setActiveView('form')}
        >
          New Booking
        </button>
        <button
          className={`nav-button ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          My Bookings
        </button>
        <button
          className={`nav-button ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          Calendar
        </button>
      </div>

      {activeView === 'form' && <BookingForm onBookingSuccess={() => setActiveView('list')} />}
      {activeView === 'list' && <UserBookingList />}
      {activeView === 'calendar' && <UserBookingCalendar />}
    </>
  );
};

export default UserDashboard;
