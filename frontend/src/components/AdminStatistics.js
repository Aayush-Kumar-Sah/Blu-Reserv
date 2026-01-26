import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminStatistics = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    
    const totalSeatsBooked = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.numberOfSeats, 0);

    const upcomingBookings = bookings.filter(b => 
      new Date(b.bookingDate) >= now && b.status === 'confirmed'
    ).length;

    const todayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.bookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === now.getTime() && b.status === 'confirmed';
    }).length;

    const todaySeats = bookings.filter(b => {
      const bookingDate = new Date(b.bookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === now.getTime() && b.status === 'confirmed';
    }).reduce((sum, b) => sum + b.numberOfSeats, 0);

    // Calculate revenue (assuming $50 per person average)
    const estimatedRevenue = totalSeatsBooked * 50;
    const todayRevenue = todaySeats * 50;

    // Get most popular time slots
    const slotCounts = {};
    bookings.forEach(b => {
      if (b.status === 'confirmed') {
        slotCounts[b.timeSlot] = (slotCounts[b.timeSlot] || 0) + 1;
      }
    });
    const popularSlots = Object.entries(slotCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      total: bookings.length,
      confirmed,
      cancelled,
      completed,
      totalSeatsBooked,
      upcomingBookings,
      todayBookings,
      todaySeats,
      estimatedRevenue,
      todayRevenue,
      popularSlots
    };
  };

  const getRecentBookings = () => {
    return bookings
      .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
      .slice(0, 5);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  const stats = getStatistics();
  const recentBookings = getRecentBookings();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#667eea', margin: 0 }}>📊 Dashboard Statistics</h2>
        <button onClick={fetchBookings} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {/* Main Statistics Grid */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{stats.confirmed}</div>
          <div className="stat-label">Active Bookings</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Today's Highlights */}
      <div className="grid grid-2" style={{ marginBottom: '30px' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.3rem' }}>📅 Today's Activity</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.todayBookings}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Bookings Today</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.todaySeats}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Guests Expected</div>
            </div>
          </div>
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '8px' 
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '5px' }}>
              Estimated Revenue Today
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              ${stats.todayRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#667eea' }}>📈 Overall Metrics</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Total Seats Booked:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937' }}>
                {stats.totalSeatsBooked}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Upcoming Bookings:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981' }}>
                {stats.upcomingBookings}
              </span>
            </div>
          </div>
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#f0fdf4', 
            borderRadius: '8px',
            border: '2px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '5px' }}>
              Total Estimated Revenue
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#15803d' }}>
              ${stats.estimatedRevenue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Time Slots */}
      {stats.popularSlots.length > 0 && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#667eea' }}>⭐ Most Popular Time Slots</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {stats.popularSlots.map(([slot, count], index) => (
              <div key={slot} style={{ 
                flex: '1 1 200px',
                padding: '15px',
                background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                           index === 1 ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' :
                           'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
                color: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                  {slot}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {count} bookings
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#667eea' }}>🕐 Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <div className="info">No recent bookings</div>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{booking.customerName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {booking.customerEmail}
                      </div>
                    </td>
                    <td>{formatDate(booking.bookingDate)}</td>
                    <td>{booking.timeSlot}</td>
                    <td>
                      <span className="badge badge-primary">
                        {booking.numberOfSeats}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${
                        booking.status === 'confirmed' ? 'success' : 
                        booking.status === 'cancelled' ? 'danger' : 'warning'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;
