import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); // Default to newest first

  const user = JSON.parse(localStorage.getItem('user'));
  const manager = JSON.parse(localStorage.getItem('manager'));
  const demoUser = JSON.parse(localStorage.getItem('demoUser'));

  const isManager = !!manager;
  const currentUserEmail = user?.email || demoUser?.email || '';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const response = isManager 
        ? await bookingAPI.getAllBookings()
        : await bookingAPI.getUserBookings(currentUserEmail);
      
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // HELPER FUNCTION: Check if booking is truly in the past
  const isBookingPast = (bookingDate, timeSlot) => {
    const bookingDay = new Date(bookingDate);
    
    // Parse the start time from timeSlot (e.g., "12:00-13:00")
    const startTime = timeSlot.split('-')[0].trim();
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Set the exact booking time
    bookingDay.setHours(hours, minutes, 0, 0);
    
    // Compare with current time
    const now = new Date();
    return bookingDay < now;
  };

  const handleCancelBooking = async (id, bookingDate, timeSlot) => {
    // Use the helper function to check if booking is truly past
    const isPast = isBookingPast(bookingDate, timeSlot);
    
    if (isPast && !isManager) {
      toast.error('Cannot cancel past bookings');
      return;
    }

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
    if (!isManager) {
      toast.error('Only managers can delete bookings');
      return;
    }

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

  const getStatistics = () => {
    const upcoming = bookings.filter(b => 
      b.status === 'confirmed' && !isBookingPast(b.bookingDate, b.timeSlot)
    ).length;

    const past = bookings.filter(b => 
      isBookingPast(b.bookingDate, b.timeSlot)
    ).length;

    const cancelled = bookings.filter(b => b.status === 'cancelled').length;

    const totalSeats = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.numberOfSeats, 0);

    if (isManager) {
      return { upcoming, past, cancelled, total: bookings.length, totalSeats };
    }

    return { upcoming, past, cancelled, total: bookings.length };
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      if (filter === 'upcoming') {
        return booking.status === 'confirmed' && !isBookingPast(booking.bookingDate, booking.timeSlot);
      }
      if (filter === 'past') {
        return isBookingPast(booking.bookingDate, booking.timeSlot);
      }
      if (filter !== 'all' && booking.status !== filter) return false;
      
      if (searchTerm && isManager) {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.customerName.toLowerCase().includes(searchLower) ||
          booking.customerEmail.toLowerCase().includes(searchLower) ||
          booking.customerPhone.includes(searchTerm)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.bookingDate) - new Date(b.bookingDate);
          break;
        case 'name':
          comparison = a.customerName.localeCompare(b.customerName);
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

  const renderSeats = (booking) => {
    const seats =
      booking.seats ||
      booking.seatNumbers ||
      booking.selectedSeats;

    if (!seats || seats.length === 0) {
      return <span style={{ color: '#9ca3af' }}>—</span>;
    }

    if (Array.isArray(seats)) {
      return (
        <span style={{ fontSize: '0.85rem', color: '#1f2937' }}>
          {seats.join(', ')}
        </span>
      );
    }

    // If seats are strings (seat IDs)
    return (
      <span style={{ fontSize: '0.85rem', color: '#1f2937' }}>
        {seats}
      </span>
    );
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#667eea', margin: 0 }}>
          📋 {isManager ? 'All Bookings' : 'My Bookings'}
        </h2>
        <button onClick={fetchBookings} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        {isManager ? (
          <>
            <div className="stat-card stat-primary">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-value">{stats.upcoming}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-value">{stats.past}</div>
              <div className="stat-label">Past</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-value">{stats.cancelled}</div>
              <div className="stat-label">Cancelled</div>
            </div>
            <div className="stat-card stat-info">
              <div className="stat-value">{stats.totalSeats}</div>
              <div className="stat-label">Total Seats</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card stat-success">
              <div className="stat-value">{stats.upcoming}</div>
              <div className="stat-label">Upcoming Bookings</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-value">{stats.past}</div>
              <div className="stat-label">Past Bookings</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-value">{stats.cancelled}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </>
        )}
      </div>

      <div className="filters-container">
        {isManager && (
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
        )}
        
        <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="upcoming">📅 Upcoming</option>
            <option value="past">🕐 Past</option>
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
            {isManager && <option value="name">Sort by Name</option>}
            <option value="seats">Sort by Seats</option>
          </select>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{ padding: '12px 20px' }}
        >
          {sortOrder === 'asc' ? '↑ Oldest' : '↓ Newest'}
        </button>
      </div>

      {filteredAndSortedBookings.length === 0 ? (
        <div className="info">
          {bookings.length === 0 
            ? '🍽️ No bookings yet. Make your first reservation!' 
            : 'No bookings found matching your criteria.'}
        </div>
      ) : (
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <div style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
            Showing {filteredAndSortedBookings.length} of {bookings.length} bookings
          </div>
          <table className="table">
            <thead>
              <tr>
                {isManager && <th>Customer Name</th>}
                {isManager && <th>Email</th>}
                {isManager && <th>Phone</th>}
                <th>Date</th>
                <th>Time Slot</th>
                <th>Seats</th>
                <th>Seat Numbers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.map((booking) => {
                const isPast = isBookingPast(booking.bookingDate, booking.timeSlot);
                return (
                  <tr key={booking._id} style={{ opacity: isPast ? 0.7 : 1 }}>
                    {isManager && <td>{booking.customerName}</td>}
                    {isManager && <td>{booking.customerEmail}</td>}
                    {isManager && <td>{booking.customerPhone}</td>}
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>{booking.timeSlot}</td>
                    <td>{booking.numberOfSeats}</td>
                    <td>{renderSeats(booking)}</td>
                    <td>
                      <span className={`badge badge-${
                        booking.status === 'confirmed' ? 'success' : 
                        booking.status === 'cancelled' ? 'danger' : 'warning'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {booking.status === 'confirmed' && !isPast && (
                        <button
                          onClick={() => handleCancelBooking(booking._id, booking.bookingDate, booking.timeSlot)}
                          className="btn btn-warning"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                      )}
                        {isManager && (
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Delete
                          </button>
                        )}
                        {!isManager && booking.status === 'confirmed' && isPast && (
                          <span style={{ fontSize: '0.85rem', color: '#999', padding: '6px' }}>
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList;