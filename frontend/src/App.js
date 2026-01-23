import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ManagerLogin from './components/ManagerLogin';
import MainApp from './components/MainApp';
import BookingConfirm from './components/BookingConfirm';
import BookingCancel from './components/BookingCancel';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<MainApp />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/app" element={<MainApp />} />

        <Route path="/booking/confirm/:id" element={<BookingConfirm />} />
        <Route path="/booking/cancel/:id" element={<BookingCancel />} />
      </Routes>
    </Router>
  );
}

export default App;
