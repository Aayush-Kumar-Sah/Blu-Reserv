import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import BookingForm from "../components/BookingForm";
import BookingCalendar from "../components/BookingCalendar";
import BookingList from "../components/BookingList";
import MaintenanceManager from "../components/MaintenanceManager";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../App.css"; // IMPORTANT

function MainApp() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const manager = JSON.parse(localStorage.getItem("manager"));
  const demoUser = JSON.parse(localStorage.getItem("demoUser"));

  const isManager = !!manager;

  // Set default view based on user type
  const [activeView, setActiveView] = useState(isManager ? "list" : "form");

  useEffect(() => {
    if (!user && !manager && !demoUser) {
      navigate("/");
    }
  }, [user, manager, demoUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("manager");
    localStorage.removeItem("demoUser");
    navigate("/");
  };

  return (
    <div className={`app-background ${activeView}`}>

      {/* HEADER + NAV */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        user={user}
        manager={manager}
        demoUser={demoUser}
        isManager={isManager}
      />

      {/* PAGE CONTENT */}
      <div className="page-content">
        {/* Only show booking form for non-managers */}
        {activeView === "form" && !isManager && (
          <BookingForm
            onBookingSuccess={() => setActiveView("list")}
            currentUser={user || demoUser}
          />
        )}
        {activeView === "calendar" && <BookingCalendar />}
        {activeView === "list" && <BookingList />}
        {activeView === "maintenance" && isManager && <MaintenanceManager />}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default MainApp;