import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1 className="landing-title">Restaurant Seat Booking</h1>
                <p className="landing-subtitle">Experience dining like never before</p>
                <button className="start-button" onClick={() => navigate('/app')}>
                    Start
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
