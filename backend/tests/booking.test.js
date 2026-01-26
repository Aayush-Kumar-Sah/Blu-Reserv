jest.mock("../models/Booking");
jest.mock("../models/Restaurant");
jest.mock("../services/twilioService");
jest.mock("../services/emailService");

const Booking = require("../models/Booking");
const Restaurant = require("../models/Restaurant");
const { createBooking } = require("../controllers/bookingController");

describe("Booking Controller - Unit Test", () => {

  // ---------------------------
  // 1️⃣ SUCCESS CASE (201)
  // ---------------------------
  it("should create a booking and return 201", async () => {
    const req = {
      body: {
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "9999999999",
        bookingDate: "2026-02-01",
        timeSlot: "10:00-11:00",
        numberOfSeats: 2,
        selectedSeats: ["A1", "A2"],
        specialRequests: "Window seat",
        notificationPreference: "sms"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Restaurant.findOne.mockResolvedValue({
      _id: "rest_123",
      totalSeats: 50,
      seats: [],
      tables: [],
      bookings: []
    });

    Booking.find = jest.fn().mockResolvedValue([]);

    Booking.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: "mock_booking_id",
        ...req.body
      })
    }));

    await createBooking(req, res);

    // ✅ Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          booking: expect.any(Object)
        })
      );      
  });

  // ---------------------------------
  // 2️⃣ VALIDATION FAILURE (400)
  // ---------------------------------
  it("should return 400 when required fields are missing", async () => {
    const req = {
      body: {
        customerName: "Test User" // missing required fields
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await createBooking(req, res);

    // ✅ Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });

  // ---------------------------------
  // 3️⃣ SEATS UNAVAILABLE (400)
  // ---------------------------------
  it("should return 400 if seats are unavailable", async () => {
    const req = {
      body: {
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "9999999999",
        bookingDate: "2026-02-01",
        timeSlot: "10:00-11:00",
        numberOfSeats: 5,
        selectedSeats: ["A1", "A2", "A3", "A4", "A5"],
        notificationPreference: "sms"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    Restaurant.findOne.mockResolvedValue({
      _id: "rest_123",
      totalSeats: 2, // less than requested
      seats: [],
      tables: [],
      bookings: []
    });

    Booking.find = jest.fn().mockResolvedValue([]);

    await createBooking(req, res);

    // ✅ Assertions
    expect(res.status).toHaveBeenCalledWith(400);
  });

});
