import React, { useState } from 'react';
import '../App.css';
import BookingForm from './BookingForm';
import BookingList from './BookingList';
import BookingCalendar from './BookingCalendar';
import MaintenanceManager from './MaintenanceManager'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function MainApp() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const manager = JSON.parse(localStorage.getItem('manager'));
    const demoUser = JSON.parse(localStorage.getItem('demoUser'));

    const isManager = !!manager; 
    const [activeView, setActiveView] = useState(isManager ? 'list' : 'form');
    const [editBooking, setEditBooking] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    useEffect(() => {
        if (!user && !manager && !demoUser) {
            navigate('/');
        }
    }, [user, manager, demoUser, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('manager');
        localStorage.removeItem('demoUser');
        navigate('/');
    };

    const handleModifyBooking = (booking) => {
        setEditBooking(booking);
        setActiveView('form');
    };

    const handleBookingSuccess = () => {
        setEditBooking(null);
        setRefreshTrigger(prev => prev + 1);
        setActiveView('list');
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

            <div className="nav">
                {/* Hide "New Booking" button for managers */}
                {!isManager && (
                    <button
                        className={`nav-button ${activeView === 'form' ? 'active' : ''}`}
                        onClick={() => setActiveView('form')}
                    >
                        New Booking
                    </button>
                )}
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
                    {isManager ? 'All Bookings' : 'My Bookings'}
                </button>
                {/* Only visible for managers */}
                {isManager && (
                    <button
                        className={`nav-button ${activeView === 'maintenance' ? 'active' : ''}`}
                        onClick={() => setActiveView('maintenance')}
                    >
                        🔧 Maintenance
                    </button>
                )}
            </div>
            {activeView === 'form' && !isManager && <BookingForm onBookingSuccess={handleBookingSuccess} currentUser={user || demoUser} editBooking={editBooking}/>}
            {activeView === 'calendar' && <BookingCalendar />}
            {activeView === 'list' && <BookingList onModifyBooking={handleModifyBooking} refreshTrigger={refreshTrigger} />}
            {activeView === 'maintenance' && isManager && <MaintenanceManager />}

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