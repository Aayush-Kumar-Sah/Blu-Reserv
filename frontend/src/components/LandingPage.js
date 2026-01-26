import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleIBMAuth = () => {
        const authUrl =
            'https://test.login.w3.ibm.com/v1.0/endpoint/default/authorize' +
            `?response_type=code` +
            `&client_id=ODcxNDlkMDEtN2E1OS00` +
            `&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}` +
            `&scope=${encodeURIComponent('openid profile email')}` +
            `&prompt=login`;

        window.location.href = authUrl;
    };

    const handleDemoLogin = () => {
        const demoUser = {
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@local.com',
            role: 'demo'
        };

        localStorage.removeItem('user');
        localStorage.removeItem('manager');
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        navigate('/app');
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

                    <button
                        className="start-button"
                        style={{ background: 'transparent', border: '2px solid white' }}
                        onClick={handleDemoLogin}
                    >
                        Login as Demo User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
