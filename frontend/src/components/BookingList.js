import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
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
        fetchBookings();
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking? This cannot be undone.')) {
      return;
    }

    try {
      const response = await bookingAPI.deleteBooking(id);
      if (response.data.success) {
        toast.success('Booking deleted successfully');
        fetchBookings();
      }
    } catch (error) {
      toast.error('Failed to delete booking');
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
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#667eea' }}>All Bookings</h2>
        <button onClick={fetchBookings} className="btn btn-secondary">
          Refresh
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: '600' }}>Filter by Status:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '2px solid #e0e0e0' }}
        >
          <option value="all">All Bookings</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="info">No bookings found.</div>
      ) : (
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.customerName}</td>
                  <td>{booking.customerEmail}</td>
                  <td>{booking.customerPhone}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>{booking.timeSlot}</td>
                  <td>{booking.numberOfSeats}</td>
                  <td>
                    <span className={`badge badge-${
                      booking.status === 'confirmed' ? 'success' : 
                      booking.status === 'cancelled' ? 'danger' : 'warning'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-warning"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList;
