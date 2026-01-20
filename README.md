# Restaurant Seat Booking Application

A full-stack restaurant seat booking system built with React, Node.js, Express, and MongoDB.

## Features

- **Time Slot Management**: 1-hour time slots for booking
- **Multiple Seats Booking**: Book multiple seats at once
- **Real-time Availability**: Check available seats for each time slot
- **Booking Management**: Create, view, modify, and cancel bookings
- **Calendar View**: Visual representation of bookings by date
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- React Router
- React DatePicker
- React Toastify (notifications)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Environment variables with dotenv

## Project Structure

```
SeatBooking/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── bookingController.js
│   │   └── restaurantController.js
│   ├── models/
│   │   ├── Booking.js
│   │   └── Restaurant.js
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   └── restaurantRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── BookingForm.js
    │   │   ├── BookingList.js
    │   │   └── BookingCalendar.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.css
    │   ├── App.js
    │   └── index.js
    ├── .gitignore
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/restaurant-booking
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will run on http://localhost:3000

## API Endpoints

### Booking Routes (`/api/bookings`)
- `GET /` - Get all bookings
- `GET /availability?date=YYYY-MM-DD&timeSlot=HH:MM-HH:MM` - Check availability
- `GET /date/:date` - Get bookings by date
- `GET /:id` - Get booking by ID
- `POST /` - Create new booking
- `PUT /:id` - Update booking
- `PATCH /:id/cancel` - Cancel booking
- `DELETE /:id` - Delete booking

### Restaurant Routes (`/api/restaurant`)
- `GET /` - Get restaurant settings
- `PUT /` - Update restaurant settings
- `GET /timeslots` - Get available time slots

## Default Configuration

- **Total Seats**: 50
- **Operating Hours**: 10:00 AM - 10:00 PM
- **Time Slot Duration**: 1 hour
- **Booking Range**: 1-20 seats per booking

## Usage

1. **Create a Booking**:
   - Navigate to "New Booking"
   - Fill in customer details
   - Select date and time slot
   - Choose number of seats
   - Add special requests (optional)
   - Submit the form

2. **View Calendar**:
   - Navigate to "Calendar View"
   - Select a date to see all bookings
   - View availability for each time slot

3. **Manage Bookings**:
   - Navigate to "All Bookings"
   - Filter by status (all/confirmed/cancelled)
   - Cancel or delete bookings

## Future Enhancements

- User authentication (customer and admin roles)
- Email notifications
- SMS reminders
- Table management
- Multiple restaurant support
- Payment integration
- Booking history
- Reviews and ratings
- Waitlist functionality

## License

MIT
