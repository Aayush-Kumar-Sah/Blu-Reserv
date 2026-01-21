import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleIBMAuth = () => {
        console.log('SSO started');
        // Placeholder for SSO logic
        alert('IBM SSO Auth integration to be implemented');
    };

    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1 className="landing-title">Restaurant Seat Booking</h1>
                <p className="landing-subtitle">Experience dining like never before</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                    <button className="start-button" onClick={handleIBMAuth}>
                        Login as IBM Employee
                    </button>

                    <button
                        className="start-button"
                        style={{ background: 'transparent', border: '2px solid white' }}
                        onClick={() => navigate('/manager-login')}
                    >
                        Login as Manager
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
