import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingAPI, restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';

const UserBookingCalendar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log("USER FROM STORAGE:", user);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState({});

  useEffect(() => {
    fetchRestaurantInfo();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchBookingsByDate();
      checkAllSlotAvailability();
    }
  }, [selectedDate, timeSlots]);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await restaurantAPI.getRestaurant();
      setRestaurant(response.data.restaurant);
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await restaurantAPI.getTimeSlots();
      setTimeSlots(response.data.timeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const fetchBookingsByDate = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await bookingAPI.getBookingsByDate(dateStr);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const checkAllSlotAvailability = async () => {
    if (!timeSlots.length) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const availabilityData = {};

    try {
      for (const slot of timeSlots) {
        const response = await bookingAPI.checkAvailability(dateStr, slot);
        availabilityData[slot] = response.data;
      }
      setSlotAvailability(availabilityData);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const getUserBookingsForSlot = (slot) => {
    return bookings.filter(
      b =>
        b.timeSlot === slot &&
        b.status === 'confirmed' &&
        b.customerEmail === user.email.toLowerCase()
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>📅 Booking Calendar</h2>

      {restaurant && (
        <div className="info" style={{ marginBottom: '20px' }}>
          🏪 <strong>{restaurant.name}</strong> - Total Capacity: {restaurant.totalSeats} seats
        </div>
      )}

      <div className="form-group" style={{ maxWidth: '300px', marginBottom: '30px' }}>
        <label>📆 Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker"
        />
      </div>

      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        Schedule for {formatDate(selectedDate)}
      </h3>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {timeSlots.map((slot) => {
            const userSlotBookings = getUserBookingsForSlot(slot);
            const availability = slotAvailability[slot] || {};
            const totalSeats = availability.totalSeats || 100;
            const availableSeats = availability.availableSeats || 0;
            const bookedSeats = availability.bookedSeats || 0;
            const occupancyRate = totalSeats > 0 ? (bookedSeats / totalSeats * 100).toFixed(0) : 0;
            
            let cardClass = 'calendar-slot-card ';
            if (availableSeats === 0) cardClass += 'full';
            else if (availableSeats < 10) cardClass += 'limited';
            else cardClass += 'available';

            let progressClass = 'progress-fill ';
            if (occupancyRate < 50) progressClass += 'low';
            else if (occupancyRate < 80) progressClass += 'medium';
            else progressClass += 'high';

            if (userSlotBookings.length > 0) {
              cardClass += ' user-booking-glow';
            }

            return (
              <div
                key={slot}
                className={`${cardClass} ${userSlotBookings.length > 0 ? 'user-booking-highlight' : ''}`}
              >
                {userSlotBookings.length > 0 && (
                  <div className="user-booking-ribbon">
                    BOOKED
                  </div>
                )}

                <div className="card-header" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{slot}</span>
                  <span className={`badge ${
                    availableSeats === 0 ? 'badge-danger' : 
                    availableSeats < 10 ? 'badge-warning' : 'badge-success'
                  }`}>
                    {availableSeats} available
                  </span>
                </div>
                <div className="card-body">
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span><strong>Capacity:</strong></span>
                      <span>{bookedSeats} / {totalSeats} seats</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={progressClass}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                      {occupancyRate}% full
                    </div>
                  </div>
                  
                  {userSlotBookings.length > 0 ? (
                    <>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                        Your Booking{userSlotBookings.length > 1 ? 's' : ''}:
                      </div>
                      {userSlotBookings.map((booking) => (
                        <div 
                          key={booking._id} 
                          style={{ 
                            padding: '8px', 
                            background: '#f7fafc', 
                            borderRadius: '6px',
                            marginBottom: '8px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <div><strong>{booking.customerName}</strong></div>
                          <div>Seats: {booking.numberOfSeats} | {booking.customerPhone}</div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>
                      No bookings for this slot
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserBookingCalendar;
