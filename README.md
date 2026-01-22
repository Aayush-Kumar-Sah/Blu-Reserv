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

## Architecture & Code Flow

This section details how the different parts of the application interact to provide a seamless booking experience.

### High-Level Overview
The application follows a standard **Client-Server-Database** architecture:

1.  **Frontend (React)**: The user interface where customers interact with the system (view availability, book seats).
2.  **Backend (Express/Node.js)**: The RESTful API that handles business logic, validation, and database interactions.
3.  **Database (MongoDB)**: Stores persistent data like bookings and restaurant settings.

---

### 1. Frontend Architecture (`frontend/`)

The frontend is a React Single Page Application (SPA).

*   **Entry Point**: `src/index.js` bootstraps the React app by rendering `src/App.js` into the DOM.
*   **Routing (`src/App.js`)**: Uses `react-router-dom` to manage navigation:
    *   `/` -> **LandingPage**: A static welcome page with a "Start" button.
    *   `/app` -> **MainApp**: The core booking application dashboard.
*   **Main Application (`src/components/MainApp.js`)**: Manages the state of the active view (`form`, `calendar`, `list`) and renders the corresponding components:
    *   **BookingForm**: A form to capture customer details and desired booking time. It calls `checkAvailability` API on date/time selection.
    *   **BookingCalendar**: Displays a visual calendar to see bookings per day.
    *   **BookingList**: A list view of all bookings, allowing cancellation or deletion.
*   **API Layer (`src/services/api.js`)**: A centralized Axios instance configured with the base URL. It exports methods like `bookingAPI.createBooking` or `bookingAPI.checkAvailability` that components use to fetch data. This decouples UI components from direct HTTP calls.

### 2. Backend Architecture (`backend/`)

The backend is an Express.js server providing a JSON API.

*   **Entry Point**: `server.js` initializes the Express app, connects to MongoDB via `config/db.js`, sets up middleware (CORS, Body Parser), and mounts routes.
*   **Routes (`backend/routes/`)**:
    *   `bookingRoutes.js`: Maps HTTP endpoints (e.g., `POST /`, `GET /availability`) to controller functions.
    *   `restaurantRoutes.js`: Handles restaurant configuration endpoints.
*   **Controllers (`backend/controllers/`)**: Contains the business logic:
    *   `bookingController.js`:
        *   `createBooking`: Validates input -> Checks capacity (Total Seats - Booked Seats) -> Saves booking -> Returns success.
        *   `checkAvailability`: Aggregates confirmed bookings for a specific slot to calculate remaining seats.
*   **Data Models (`backend/models/`)**: Mongoose schemas defining data structure:
    *   `Booking.js`: Stores customer info, date, time slot, seat count, and status (`confirmed`, `cancelled`).
    *   `Restaurant.js`: Stores global settings like total seats, opening hours, etc.

---

### 3. Data Flow Example: Creating a Booking

1.  **User Action**: User selects a date and time on the `BookingForm`.
2.  **Frontend Check**: `BookingForm` calls `bookingAPI.checkAvailability(date, time)`.
3.  **API Request**: Frontend sends `GET /api/bookings/availability?date=...&timeSlot=...` to Backend.
4.  **Backend Logic**:
    *   `bookingController.checkAvailability` runs.
    *   Queries `Restaurant` model for total seats (default 50).
    *   Queries `Booking` model for all *confirmed* bookings at that time.
    *   Calculates `Available = Total - Sum(Booked)`.
    *   Returns JSON `{ availableSeats: 5 }`.
5.  **UI Update**: Frontend displays "5 seats available".
6.  **Submission**: User clicks "Book".
7.  **Final Validation**: Backend performs the check *again* (concurrency safety) before saving to ensure seats weren't taken in the interim.
8.  **Persistence**: Booking is saved to MongoDB.

## Project Structure

```
SeatBooking/
├── backend/
│   ├── config/             # Database connection logic
│   ├── controllers/        # Request handlers (Business logic)
│   ├── models/             # Mongoose schemas (Data definitions)
│   ├── routes/             # API route definitions
│   └── server.js           # App entry point & configuration
└── frontend/
    ├── src/
    │   ├── components/     # UI Components (Forms, Lists, Calendar)
    │   ├── services/       # API integration service
    │   ├── App.js          # Routing configuration
    │   ├── MainApp.js      # Main dashboard layout
    │   └── LandingPage.js  # Welcome page
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
   PORT=5555
   MONGODB_URI= your mongodb connection string
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

## License

MIT
