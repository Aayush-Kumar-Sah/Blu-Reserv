import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Booking APIs
export const bookingAPI = {
  getAllBookings: () => api.get('/bookings'),

  getUserBookings: (email) => api.get(`/bookings/user/${encodeURIComponent(email)}`),

  getBookingById: (id) => api.get(`/bookings/${id}`),

  getBookingsByDate: (date) => api.get(`/bookings/date/${date}`),

  checkAvailability: (date, timeSlot) =>
    api.get('/bookings/availability', { params: { date, timeSlot } }),

  getOccupiedSeats: (date, timeSlot) => 
    api.get('/bookings/occupied', { params: { date, timeSlot } }),

  createBooking: (bookingData) => api.post('/bookings', bookingData),

  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),

  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),

  deleteBooking: (id) => api.delete(`/bookings/${id}`),

};

// Restaurant APIs
export const restaurantAPI = {
  getRestaurant: () => api.get('/restaurant'),

  updateRestaurant: (restaurantData) => api.put('/restaurant', restaurantData),

  getTimeSlots: () => api.get('/restaurant/timeslots'),
};

// Manager APIs
export const managerAPI = {
  login: (credentials) => api.post('/manager/login', credentials),
};

export const maintenanceAPI = {
  getMaintenanceSeats: () => api.get('/maintenance'),
  
  getAllRecords: () => api.get('/maintenance/records'),
  
  markSeatMaintenance: (data) => api.post('/maintenance', data),
  
  removeSeatMaintenance: (id) => api.delete(`/maintenance/${id}`),
  
  bulkRemoveMaintenance: (seatIds) => api.post('/maintenance/bulk', { seatIds })
};

export default api;
