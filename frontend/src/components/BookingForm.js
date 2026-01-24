import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingAPI, restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';

import eatIcon from "../assets/eating.png"

const BookingForm = ({ onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: new Date(),
    timeSlot: '',
    numberOfSeats: 1,
    specialRequests: '',
    notificationPreference: 'both'
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchRestaurantInfo();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (formData.timeSlot && formData.bookingDate) {
      checkAvailability();
    }
  }, [formData.timeSlot, formData.bookingDate]);

  
  useEffect(() => {
  console.log("PREFERENCE STATE:", formData.notificationPreference);
}, [formData.notificationPreference]);


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

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'customerName':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name should only contain letters and spaces';
        } else if (value && value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      
      case 'customerPhone':
        if (value && !/^[+\d\s()-]+$/.test(value)) {
          error = 'Phone number should only contain numbers and +()-';
        } else if (value && value.replace(/[^\d]/g, '').length < 10) {
          error = 'Phone number must be at least 10 digits';
        }
        break;
      
      case 'customerEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      
      case 'numberOfSeats':
        if (value && (value < 1 || value > 20)) {
          error = 'Number of guests must be between 1 and 20';
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      bookingDate: date,
      timeSlot: '' // Reset time slot when date changes
    }));
  };

  // Filter time slots based on current time if booking is for today
  const getAvailableTimeSlots = () => {
    const today = new Date();
    const selectedDate = new Date(formData.bookingDate);
    
    // Reset time parts for date comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    // If booking is not for today, show all slots
    if (selectedDate.getTime() !== today.getTime()) {
      return timeSlots;
    }
    
    // If booking is for today, filter out past slots
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    return timeSlots.filter(slot => {
      // Extract start time from slot (format: "HH:MM-HH:MM")
      const startTime = slot.split('-')[0].trim();
      const [slotHour, slotMinute] = startTime.split(':').map(Number);
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      
      // Only show slots that haven't started yet
      return slotTimeInMinutes > currentTimeInMinutes;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const errors = {};
    errors.customerName = validateField('customerName', formData.customerName);
    errors.customerEmail = validateField('customerEmail', formData.customerEmail);
    errors.customerPhone = validateField('customerPhone', formData.customerPhone);
    errors.numberOfSeats = validateField('numberOfSeats', formData.numberOfSeats);
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    // If there are validation errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }
    
    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        bookingDate: formData.bookingDate.toISOString().split('T')[0]
      };
      console.log("SUBMIT DATA:", bookingData);


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
    <div className="premium-booking-container fade-in">
      <div className="premium-form-card">
        <div className="premium-header">
          <div className="restaurant-logo">
            <img
              src={eatIcon}
              alt="Restaurant logo"
              className="restaurant-logo-icon"
            />
          </div>
          <h1 className="premium-title">Reserve Your Seats</h1>
          <p className="premium-subtitle">Experience fine dining at its best</p>
        </div>
        
        {restaurant && (
          <div className="premium-info-bar">
            <div className="info-badge">
              <span className="badge-icon">🏛</span>
              <span className="badge-text">{restaurant.name}</span>
            </div>
            <div className="info-badge">
              <span className="badge-icon">⏰</span>
              <span className="badge-text">{restaurant.openingTime} - {restaurant.closingTime}</span>
            </div>
            <div className="info-badge">
              <span className="badge-icon">👥</span>
              <span className="badge-text">{restaurant.totalSeats} Seats</span>
            </div>
          </div>
        )}

<form onSubmit={handleSubmit} className="premium-form">
          <div className="premium-section">
            <h3 className="section-heading">Guest Information</h3>
            <div className="form-row">
              <div className="premium-input-group">
                <label className="premium-label">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className={`premium-input ${validationErrors.customerName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {validationErrors.customerName && (
                  <span className="validation-error">{validationErrors.customerName}</span>
                )}
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Email Address</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  className={`premium-input ${validationErrors.customerEmail ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                />
                {validationErrors.customerEmail && (
                  <span className="validation-error">{validationErrors.customerEmail}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="premium-input-group">
                <label className="premium-label">Phone Number</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  className={`premium-input ${validationErrors.customerPhone ? 'error' : ''}`}
                  placeholder="+1 (555) 000-0000"
                />
                {validationErrors.customerPhone && (
                  <span className="validation-error">{validationErrors.customerPhone}</span>
                )}
              </div>

              <div className="premium-input-group">
                <label className="premium-label">Party Size</label>
                <input
                  type="number"
                  name="numberOfSeats"
                  value={formData.numberOfSeats}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className={`premium-input ${validationErrors.numberOfSeats ? 'error' : ''}`}
                  placeholder="Number of guests"
                />
                {validationErrors.numberOfSeats && (
                  <span className="validation-error">{validationErrors.numberOfSeats}</span>
                )}
            </div>
          </div>
        </div>

<div className="premium-section">
            <h3 className="section-heading">Reservation Details</h3>
            <div className="premium-input-group">
              <label className="premium-label">Select Date</label>
              <DatePicker
                selected={formData.bookingDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="EEEE, MMMM d, yyyy"
                className="premium-datepicker"
                required
              />
            </div>

            <div className="premium-input-group">
              <label className="premium-label">Choose Time</label>
              <div className="premium-time-grid">
                {getAvailableTimeSlots().length > 0 ? (
                  getAvailableTimeSlots().map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`premium-time-slot ${formData.timeSlot === slot ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                      
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <div className="no-slots-message" style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999',
                    gridColumn: '1 / -1'
                  }}>
                    No available time slots for today. Please select a future date.
                  </div>
                )}
            </div>
          </div>
        </div>

        {formData.timeSlot && availability.availableSeats !== undefined && (
            <div className={`premium-availability ${availability.availableSeats > 0 ? 'available' : 'full'}`}>
              <div className="availability-content">
                <div className="availability-icon-wrapper">
                  {availability.availableSeats > 0 ? (
                    <svg className="availability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="availability-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="availability-text">
                  <div className="availability-title">
                    {availability.availableSeats > 0 ? 'Tables Available' : 'Fully Booked'}
                  </div>
                  <div className="availability-count">
                    {availability.availableSeats} of {availability.totalSeats} seats remaining
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="premium-section">
            <h3 className="section-heading">Special Requests</h3>
            <div className="premium-input-group">
              <label className="premium-label">Additional Information (Optional)</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="premium-textarea"
                placeholder="Let us know about any dietary restrictions, allergies, special occasions, or seating preferences..."
                rows="4"
              />
            </div>
          </div>
          <div className="premium-section">
  <h3 className="section-heading">Notification Preference</h3>

  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
    <label>
      <input
        type="radio"
        name="notificationPreference"
        value="sms"
        checked={formData.notificationPreference === 'sms'}
        onChange={handleChange}
      />
      SMS
    </label>

    <label>
      <input
        type="radio"
        name="notificationPreference"
        value="email"
        checked={formData.notificationPreference === 'email'}
        onChange={handleChange}
      />
      Email
    </label>

    <label>
      <input
        type="radio"
        name="notificationPreference"
        value="both"
        checked={formData.notificationPreference === 'both'}
        onChange={handleChange}
      />
      Both
    </label>
  </div>
</div>


          <button 
            type="submit" 
            className="premium-submit-btn"
            disabled={loading || !formData.timeSlot || availability.availableSeats === 0}
          >
            {loading ? (
              <>
                <span className="btn-loading-spinner"></span>
                <span>Processing Reservation...</span>
              </>
            ) : (
              <>
                <span>Confirm Reservation</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
          
          <div className="premium-footer">
            <p className="security-note">
              <svg className="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your information is secure and confidential
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
