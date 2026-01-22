import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleIBMAuth = () => {
        const clientId = 'ODcxNDlkMDEtN2E1OS00';
        const redirectUri = encodeURIComponent('http://localhost:3000/callback');
        const scope = encodeURIComponent('openid profile email');
        const responseType = 'code';

        const authUrl =
            'https://test.login.w3.ibm.com/oidc/endpoint/default/.well-known/openid-configuration' +
            `?client_id=${clientId}` +
            `&response_type=${responseType}` +
            `&scope=${scope}` +
            `&redirect_uri=${redirectUri}`;

        window.location.href = authUrl;
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
