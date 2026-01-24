const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Reminder Email

const sendReminderEmail = async (booking) => {
  try {
    const yesLink = `${FRONTEND_URL}/booking/confirm/${booking._id}`;
    const noLink  = `${FRONTEND_URL}/booking/cancel/${booking._id}`;

    const mailOptions = {
      from: `"Blu-Reserv" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: "Are you coming?",
      html: `
        <h2>Hello ${booking.customerName} 👋</h2>
        <p>Your booking is in 10 minutes.</p>
        <p><b>Time Slot:</b> ${booking.timeSlot}</p>
        <p>Please confirm your arrival:</p>
        <br/>

        <a href="${yesLink}" 
           style="padding:10px 20px;background:#22c55e;color:white;text-decoration:none;border-radius:6px;">
           ✅ YES
        </a>

        <a href="${noLink}" 
           style="padding:10px 20px;background:#ef4444;color:white;text-decoration:none;border-radius:6px;margin-left:10px;">
           ❌ NO
        </a>

        <br/><br/>
        <p>– Blu-Reserv Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Reminder email sent");
    return true;
  } catch (err) {
    console.error(" Reminder email failed:", err.message);
    return false;
  }
};


// Time Alert Email

const sendTimeAlertEmail = async (booking) => {
  try {
    const mailOptions = {
      from: `"Blu-Reserv" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: "It's time for your booking 🍽️",
      html: `
        <h2>Hi ${booking.customerName} 👋</h2>
        <p>Your table is ready!</p>
        <p><b>Slot:</b> ${booking.timeSlot}</p>
        <p>Please arrive on time to avoid cancellation.</p>
        <br/>
        <p>– Blu-Reserv Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(" Time alert email sent");
    return true;
  } catch (err) {
    console.error("Time alert email failed:", err.message);
    return false;
  }
};


// Cancel Email

const sendCancelEmail = async (booking) => {
  try {
    const mailOptions = {
      from: `"Blu-Reserv" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: "Booking Cancelled ",
      html: `
        <h2>Hello ${booking.customerName}</h2>
        <p>Your booking has been cancelled due to no arrival within 15 minutes.</p>
        <p>Slot: ${booking.timeSlot}</p>
        <br/>
        <p>– Blu-Reserv Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Cancel email sent");
    return true;
  } catch (err) {
    console.error(" Cancel email failed:", err.message);
    return false;
  }
};
const sendBookingConfirmationEmail = async (booking) => {
  try {
    const mailOptions = {
      from: `"Blu-Reserv" <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: "✅ Booking Confirmed",
      html: `
        <h2>Hello ${booking.customerName} 👋</h2>
        <p>Your booking has been successfully confirmed.</p>
        <p><b>Date:</b> ${new Date(booking.bookingDate).toDateString()}</p>
        <p><b>Time Slot:</b> ${booking.timeSlot}</p>
        <p><b>Seats:</b> ${booking.numberOfSeats}</p>
        <br/>
        <p>Thank you for choosing Blu-Reserv 💙</p>
        <p>– Blu-Reserv Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Booking confirmation email sent");
    return true;
  } catch (err) {
    console.error("❌ Booking confirmation email failed:", err.message);
    return false;
  }
};

module.exports = {
  sendReminderEmail,
  sendTimeAlertEmail,
  sendCancelEmail,
  sendBookingConfirmationEmail 
};
