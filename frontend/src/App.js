import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ManagerLogin from './components/ManagerLogin';
import MainApp from './components/MainApp';
import BookingConfirm from './components/BookingConfirm';
import BookingCancel from './components/BookingCancel';
import MaintenanceManager from './components/MaintenanceManager';

import Callback from './components/Callback';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage/>} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="/maintenance" element={<MaintenanceManager />} />

        <Route path="/booking/confirm/:id" element={<BookingConfirm />} />
        <Route path="/booking/cancel/:id" element={<BookingCancel />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
