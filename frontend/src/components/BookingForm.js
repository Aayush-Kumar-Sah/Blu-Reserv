import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingForm.css';
import { bookingAPI, restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';
import SeatBooking from './SeatBooking';

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

  const [currentStep, setCurrentStep] = useState(1);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);


  useEffect(() => {
    fetchRestaurantInfo();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (formData.timeSlot && formData.bookingDate) {
      checkAvailability();
      setSelectedSeatIds([]); 
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
        if (value) {
          const digits = value.replace(/\D/g, '');
          if (!/^[+\d\s()-]+$/.test(value)) {
            error = 'Phone number can only contain numbers, +, -, (), and spaces';
          } else if (digits.length < 10 || digits.length > 15) {
            error = 'Phone number must be between 10 and 15 digits';
          }
        }
        break;
      
      case 'customerEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      
      case 'numberOfSeats':
        if (value && (value < 1 || value > 100)) {
          error = 'Number of guests must be between 1 and 100';
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, bookingDate: date, timeSlot: '' }));
  };

  const nextStep = () => {
    // Validate current step before moving forward
    if (currentStep === 1) {
      if (!formData.bookingDate || !formData.timeSlot || !formData.numberOfSeats) {
        toast.warn('Please complete all fields');
        return;
      }
    } else if (currentStep === 2) {
      if (selectedSeatIds.length !== parseInt(formData.numberOfSeats)) {
        toast.error(`Please select exactly ${formData.numberOfSeats} seats`);
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // NEW: Callback when seats are confirmed in the child component
  const handleSeatsConfirmed = (seats) => {
    setSelectedSeatIds(seats);
    toast.success(`${seats.length} seats selected`);
  };

  // Filter time slots based on current time if booking is for today
  const getAvailableTimeSlots = () => {
    const today = new Date();
    const selectedDate = new Date(formData.bookingDate);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() !== today.getTime()) return timeSlots;
    
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    return timeSlots.filter(slot => {
      const startTime = slot.split('-')[0].trim();
      const [slotHour, slotMinute] = startTime.split(':').map(Number);
      return (slotHour * 60 + slotMinute) > currentTimeInMinutes;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate step 3 fields before submission
    const errors = {};
    errors.customerName = validateField('customerName', formData.customerName);
    errors.customerEmail = validateField('customerEmail', formData.customerEmail);
    errors.customerPhone = validateField('customerPhone', formData.customerPhone);
    
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors || !formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setValidationErrors(errors);
      toast.error('Please fill in all required details');
      return;
    }
    
    // Ensure seats match party size
    if (selectedSeatIds.length !== parseInt(formData.numberOfSeats)) {
        toast.error(`Please select exactly ${formData.numberOfSeats} seats.`);
        return;
    }
    
    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        bookingDate: formData.bookingDate.toISOString().split('T')[0],
        selectedSeats: selectedSeatIds // Include the selected seats
      };
      console.log("SUBMIT DATA:", bookingData);

      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.data.success) {
        toast.success('Booking created successfully!');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          bookingDate: new Date(),
          timeSlot: '',
          numberOfSeats: 1,
          specialRequests: '',
          notificationPreference: 'both'
        });
        setSelectedSeatIds([]);
        setAvailability({});
        if (onBookingSuccess) onBookingSuccess();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="wizard-step">
            <h3 className="section-heading">When would you like to dine?</h3>
            
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
                  <div className="no-slots-message">
                    No available time slots for today. Please select a future date.
                  </div>
                )}
              </div>
            </div>

            <div className="premium-input-group">
              <label className="premium-label">Party Size</label>
              <input
                type="number"
                name="numberOfSeats"
                value={formData.numberOfSeats}
                onChange={handleChange}
                min="1"
                max="100"
                required
                className={`premium-input ${validationErrors.numberOfSeats ? 'error' : ''}`}
                placeholder="Number of guests"
              />
              {validationErrors.numberOfSeats && (
                <span className="validation-error">{validationErrors.numberOfSeats}</span>
              )}
            </div>

            <button type="button" className="wizard-next-btn" onClick={nextStep}>
              Next: Select Seats
            </button>
          </div>
        );

      case 2:
        return (
          <div className="wizard-step">
            <h3 className="section-heading">Select Your Seats</h3>
            <p style={{textAlign: 'center', marginBottom: '20px', color: '#4a5568'}}>
              Please select {formData.numberOfSeats} seat(s) for your party
            </p>
            
            <SeatBooking 
              bookingDate={formData.bookingDate}
              timeSlot={formData.timeSlot}
              partySize={parseInt(formData.numberOfSeats)}
              onConfirm={handleSeatsConfirmed}
              onBack={null}
              embedded={true}
            />

            <div className="wizard-buttons">
              <button type="button" className="wizard-back-btn" onClick={prevStep}>
                Back
              </button>
              <button 
                type="button" 
                className="wizard-next-btn" 
                onClick={nextStep}
                disabled={selectedSeatIds.length !== parseInt(formData.numberOfSeats)}
              >
                Next: Your Details
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="wizard-step">
            <h3 className="section-heading">Your Information</h3>
            
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
              <label className="premium-label">Special Requests (Optional)</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="premium-textarea"
                placeholder="Dietary restrictions, allergies, special occasions..."
                rows="3"
              />
            </div>

            <div className="premium-input-group">
              <label className="premium-label">Notification Preference</label>
              <div className="notification-options">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="notificationPreference"
                    value="sms"
                    checked={formData.notificationPreference === 'sms'}
                    onChange={handleChange}
                  />
                  <span>SMS</span>
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    name="notificationPreference"
                    value="email"
                    checked={formData.notificationPreference === 'email'}
                    onChange={handleChange}
                  />
                  <span>Email</span>
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    name="notificationPreference"
                    value="both"
                    checked={formData.notificationPreference === 'both'}
                    onChange={handleChange}
                  />
                  <span>Both</span>
                </label>
              </div>
            </div>

            <div className="wizard-buttons">
              <button type="button" className="wizard-back-btn" onClick={prevStep}>
                Back
              </button>
              <button 
                type="submit" 
                className="wizard-submit-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="premium-booking-container">
      <div className="premium-form-card">
        <div className="premium-header">
          <img src={eatIcon} alt="Restaurant logo" className="restaurant-logo-icon" />
          <h1 className="premium-title">
            Reserve Your <span className="text-blu">Table</span>
          </h1>
          
          {/* Progress Indicator */}
          <div className="wizard-progress">
            <div className={`progress-item ${currentStep >= 1 ? 'active' : ''}`}>Date & Guests</div>
            <div className={`progress-item ${currentStep >= 2 ? 'active' : ''}`}>Select Seats</div>
            <div className={`progress-item ${currentStep >= 3 ? 'active' : ''}`}>Your Details</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}
        </form>

        <div className="security-note">
          🔒 Your information is secure and confidential
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
