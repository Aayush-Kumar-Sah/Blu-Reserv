import React, { useState } from 'react';
import '../App.css';
import BookingForm from './BookingForm';
import BookingList from './BookingList';
import BookingCalendar from './BookingCalendar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function MainApp() {
    const [activeView, setActiveView] = useState('form');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // 🔒 Protect route
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };
    
    return (
        <div className="App">
            <div className="header">
                <div className="header-top">
                    <h1>Restaurant Seat Booking</h1>

                    <div className="header-user">
                        <span>Hi, {user?.firstName}</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

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

export default MainApp;
