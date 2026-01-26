import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import ManagerDashboard from './ManagerDashboard';

function MainApp() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const manager = JSON.parse(localStorage.getItem('manager'));
  const demoUser = JSON.parse(localStorage.getItem('demoUser'));

  const isManager = !!manager; 
  useEffect(() => {
    if (!user && !manager && !demoUser) {
      navigate('/');
    }
  }, [user, manager, demoUser, navigate]);

  const isManager = !!manager; 

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('manager');
    localStorage.removeItem('demoUser');
    navigate('/');
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header-top">
          <h1>Restaurant Seat Booking</h1>

          <div className="header-user">
            {manager && <span>Manager</span>}
            {!manager && demoUser && <span>Hi, Demo</span>}
            {!manager && !demoUser && user && (
              <span>Hi, {user.firstName}</span>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <p>Book your seats for an amazing dining experience</p>
      </div>

      {manager ? <ManagerDashboard /> : <UserDashboard />}

      {/* TOASTS */}
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

export default MainApp;