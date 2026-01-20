import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingAPI, restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';

const BookingForm = ({ onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: new Date(),
    timeSlot: '',
    numberOfSeats: 1,
    specialRequests: ''
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurantInfo();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (formData.timeSlot && formData.bookingDate) {
      checkAvailability();
    }
  }, [formData.timeSlot, formData.bookingDate]);

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
      toast.error('Failed to load time slots');
    }
  };

  const checkAvailability = async () => {
    try {
      const dateStr = formData.bookingDate.toISOString().split('T')[0];
      const response = await bookingAPI.checkAvailability(dateStr, formData.timeSlot);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      bookingDate: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        bookingDate: formData.bookingDate.toISOString().split('T')[0]
      };

      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.data.success) {
        toast.success('Booking created successfully!');
        
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          bookingDate: new Date(),
          timeSlot: '',
          numberOfSeats: 1,
          specialRequests: ''
        });
        
        setAvailability({});
        
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>New Booking</h2>
      
      {restaurant && (
        <div className="info" style={{ marginBottom: '20px' }}>
          <strong>{restaurant.name}</strong> - Total Seats: {restaurant.totalSeats} | 
          Operating Hours: {restaurant.openingTime} - {restaurant.closingTime}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              placeholder="+1234567890"
            />
          </div>

          <div className="form-group">
            <label>Number of Seats *</label>
            <input
              type="number"
              name="numberOfSeats"
              value={formData.numberOfSeats}
              onChange={handleChange}
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Booking Date *</label>
          <DatePicker
            selected={formData.bookingDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Time Slot *</label>
          <div className="time-slot-grid">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`time-slot-btn ${formData.timeSlot === slot ? 'selected' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {formData.timeSlot && availability.availableSeats !== undefined && (
          <div className={availability.availableSeats > 0 ? 'success' : 'error'}>
            Available Seats: {availability.availableSeats} / {availability.totalSeats}
            {availability.availableSeats === 0 && ' - This slot is fully booked'}
          </div>
        )}

        <div className="form-group">
          <label>Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Any special requirements or notes..."
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !formData.timeSlot || availability.availableSeats === 0}
        >
          {loading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
