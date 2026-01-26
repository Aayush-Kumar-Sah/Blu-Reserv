import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

const UserBookingList = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getUserBookings(user.email);
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const res = await bookingAPI.cancelBooking(id);
      if (res.data.success) {
        toast.success('Booking cancelled successfully');
        fetchMyBookings();
      }
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking? This cannot be undone.')) {
      return;
    }

    try {
      const res = await bookingAPI.deleteBooking(id);
      if (res.data.success) {
        toast.success('Booking deleted successfully');
        fetchMyBookings();
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

  const getStatistics = () => {
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalSeats = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.numberOfSeats, 0);
    return { confirmed, cancelled, total: bookings.length, totalSeats };
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      // Filter by status
      if (filter !== 'all' && booking.status !== filter) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.bookingDate) - new Date(b.bookingDate);
          break;
        case 'seats':
          comparison = a.numberOfSeats - b.numberOfSeats;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  const stats = getStatistics();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#667eea', margin: 0 }}>📋 My Bookings</h2>
        <button onClick={fetchMyBookings} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{stats.confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-value">{stats.totalSeats}</div>
          <div className="stat-label">Total Seats Booked</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-container">
        <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="confirmed">✓ Confirmed</option>
            <option value="cancelled">✗ Cancelled</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="seats">Sort by Seats</option>
          </select>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{ padding: '12px 20px' }}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {filteredAndSortedBookings.length === 0 ? (
        <div className="info">No bookings found matching your criteria.</div>
      ) : (
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <div style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
            Showing {filteredAndSortedBookings.length} of {bookings.length} bookings
          </div>
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
              {filteredAndSortedBookings.map((booking) => (
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
                          onClick={() => cancelBooking(booking._id)}
                          className="btn btn-warning"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(booking._id)}
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

export default UserBookingList;
