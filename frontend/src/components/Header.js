import React from "react";
import '../styles/header.css';

const Header = ({ activeView, setActiveView, onLogout, user, manager, demoUser, isManager }) => {
  return (
    <div className="header">
      <div className="header-top">
        <h1>Restaurant Seat Booking</h1>
        <div className="header-user">
          {manager && <span>Manager</span>}
          {!manager && demoUser && <span>Hi, Demo</span>}
          {!manager && !demoUser && user && <span>Hi, {user.firstName}</span>}
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      <p>Book your seats for an amazing dining experience</p>

      {/* Navigation */}
      <div className="nav">
        {/* Hide "New Booking" button for managers */}
        {!isManager && (
          <button
            className={`nav-button ${activeView === "form" ? "active" : ""}`}
            onClick={() => setActiveView("form")}
          >
            New Booking
          </button>
        )}
        
        <button
          className={`nav-button ${activeView === "calendar" ? "active" : ""}`}
          onClick={() => setActiveView("calendar")}
        >
          Calendar View
        </button>
        
        <button
          className={`nav-button ${activeView === "list" ? "active" : ""}`}
          onClick={() => setActiveView("list")}
        >
          {isManager ? "All Bookings" : "My Bookings"}
        </button>

        {/* Show Maintenance button only for managers */}
        {isManager && (
          <button
            className={`nav-button ${activeView === "maintenance" ? "active" : ""}`}
            onClick={() => setActiveView("maintenance")}
          >
            🔧 Maintenance
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;