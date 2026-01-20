import React, { useState } from 'react';
import './App.css';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import BookingCalendar from './components/BookingCalendar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeView, setActiveView] = useState('form');

  return (
    <div className="App">
      <div className="header">
        <h1>Restaurant Seat Booking</h1>
        <p>Book your seats for an amazing dining experience</p>
      </div>

      <div className="nav">
        <button 
          className={`nav-button ${activeView === 'form' ? 'active' : ''}`}
          onClick={() => setActiveView('form')}
        >
          New Booking
        </button>
        <button 
          className={`nav-button ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          Calendar View
        </button>
        <button 
          className={`nav-button ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          All Bookings
        </button>
      </div>

      {activeView === 'form' && <BookingForm onBookingSuccess={() => setActiveView('list')} />}
      {activeView === 'calendar' && <BookingCalendar />}
      {activeView === 'list' && <BookingList />}

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
