import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyBookings = ({ userEmail }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMyBookings();
  }, [userEmail]);

  const fetchMyBookings = async () => {
    if (!userEmail) {
      toast.error('User email not found');
      return;
    }
    
    console.log('Fetching bookings for email:', userEmail);
    
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings(userEmail);
      console.log('My bookings response:', response.data);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await bookingAPI.cancelBooking(id);
      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchMyBookings();
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking._id);
    setEditForm({
      bookingDate: new Date(booking.bookingDate),
      timeSlot: booking.timeSlot,
      numberOfSeats: booking.numberOfSeats,
      specialRequests: booking.specialRequests || '',
      notificationPreference: booking.notificationPreference || 'both'
    });
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditForm({});
  };

  const handleUpdateBooking = async (bookingId) => {
    try {
      const updateData = {
        ...editForm,
        bookingDate: editForm.bookingDate.toISOString().split('T')[0]
      };

      const response = await bookingAPI.updateBooking(bookingId, updateData);
      if (response.data.success) {
        toast.success('Booking updated successfully');
        setEditingBooking(null);
        setEditForm({});
        fetchMyBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) return false;
    return true;
  }).sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)); // Most recent first

  const upcomingBookings = filteredBookings.filter(b => 
    new Date(b.bookingDate) >= new Date() && b.status === 'confirmed'
  );
  
  const pastBookings = filteredBookings.filter(b => 
    new Date(b.bookingDate) < new Date() || b.status !== 'confirmed'
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ color: '#667eea', marginBottom: '20px' }}>📋 My Bookings</h2>

      {/* Filter Tabs */}
      <div className="filters-container" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
        <button onClick={fetchMyBookings} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#10b981', marginBottom: '15px' }}>🎯 Upcoming Bookings</h3>
          <div className="grid grid-2">
            {upcomingBookings.map((booking) => (
              <div key={booking._id} className="card" style={{ 
                borderLeft: '4px solid #10b981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
              }}>
                {editingBooking === booking._id ? (
                  /* Edit Mode */
                  <div>
                    <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#667eea' }}>
                      ✏️ Edit Booking
                    </h4>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                        Date
                      </label>
                      <DatePicker
                        selected={editForm.bookingDate}
                        onChange={(date) => setEditForm({ ...editForm, bookingDate: date })}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy"
                        className="premium-input"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                        Time Slot
                      </label>
                      <input
                        type="text"
                        value={editForm.timeSlot}
                        onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                        placeholder="e.g., 18:00-20:00"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        value={editForm.numberOfSeats}
                        onChange={(e) => setEditForm({ ...editForm, numberOfSeats: parseInt(e.target.value) })}
                        min="1"
                        max="100"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                        Special Requests
                      </label>
                      <textarea
                        value={editForm.specialRequests}
                        onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                        rows="3"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>
                        Notification Preference
                      </label>
                      <select
                        value={editForm.notificationPreference}
                        onChange={(e) => setEditForm({ ...editForm, notificationPreference: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                      >
                        <option value="sms">SMS</option>
                        <option value="email">Email</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        onClick={() => handleUpdateBooking(booking._id)}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        {formatDate(booking.bookingDate)}
                      </div>
                      <div style={{ fontSize: '1.1rem', color: '#667eea', fontWeight: '600' }}>
                        🕐 {booking.timeSlot}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <span className="badge badge-primary">
                        👥 {booking.numberOfSeats} {booking.numberOfSeats === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>

                    {booking.selectedSeats && booking.selectedSeats.length > 0 && (
                      <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                        <strong>Seats:</strong> {booking.selectedSeats.join(', ')}
                      </div>
                    )}

                    {booking.specialRequests && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '10px', 
                        background: '#f8fafc', 
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        color: '#475569'
                      }}>
                        <strong>Special Requests:</strong> {booking.specialRequests}
                      </div>
                    )}

                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        ✏️ Modify
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-danger"
                        style={{ flex: 1 }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past/Cancelled Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h3 style={{ color: '#64748b', marginBottom: '15px' }}>📜 Past Bookings</h3>
          <div className="grid grid-2">
            {pastBookings.map((booking) => (
              <div key={booking._id} className="card" style={{ 
                borderLeft: `4px solid ${booking.status === 'cancelled' ? '#ef4444' : '#94a3b8'}`,
                opacity: 0.85
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>
                    {formatDate(booking.bookingDate)}
                  </div>
                  <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '500' }}>
                    🕐 {booking.timeSlot}
                  </div>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <span className={`badge badge-${
                    booking.status === 'confirmed' ? 'success' : 
                    booking.status === 'cancelled' ? 'danger' : 'secondary'
                  }`}>
                    {booking.status.toUpperCase()}
                  </span>
                  <span className="badge badge-secondary" style={{ marginLeft: '8px' }}>
                    👥 {booking.numberOfSeats}
                  </span>
                </div>

                {booking.selectedSeats && booking.selectedSeats.length > 0 && (
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    <strong>Seats:</strong> {booking.selectedSeats.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="info">
          <p style={{ fontSize: '1.1rem' }}>You haven't made any bookings yet.</p>
          <p style={{ color: '#64748b' }}>Create your first booking to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
