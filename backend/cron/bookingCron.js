
const cron = require('node-cron');
const Booking = require('../models/Booking');
const { sendReminderSMS, sendTimeAlertSMS } = require('../services/twilioService');

console.log("bookingCron.js file loaded");

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    console.log("Cron tick:", now.toISOString());

    const bookings = await Booking.find({ status: 'confirmed' });

    for (let b of bookings) {
      if (!b.bookingDateTime) {
        console.log("No bookingDateTime, skipping", b._id.toString());
        continue;
      }

      const bookingTime = new Date(b.bookingDateTime);
      const diffMs = bookingTime.getTime() - now.getTime();
      const diffMin = Math.floor(diffMs / 60000);

      console.log("---------------");
      console.log("ID:", b._id.toString());
      console.log("Phone:", b.customerPhone);
      console.log("Time diff (min):", diffMin);
      console.log("reminderSent:", b.reminderSent);
      console.log("timeAlertSent:", b.timeAlertSent);

      // =========================
      // Reminder (8–10 min before)
      // =========================
      if (
        diffMin <= 10 &&
        diffMin > 9 &&
        b.reminderSent !== true
      ) {
        console.log("📩 Sending reminder SMS");
        await sendReminderSMS(b);
        b.reminderSent = true;
        await b.save();
        console.log("✅ Reminder SMS sent");
      }

    
      // Time alert (0–2 min window)
      if (
        diffMin <= 0 &&
        diffMin >= -2 &&
        b.timeAlertSent !== true
      ) {
        console.log("📩 Sending time alert SMS");
        await sendTimeAlertSMS(b);
        b.timeAlertSent = true;
        await b.save();
        console.log("✅ Time alert SMS sent");
      }


      // Auto-cancel after 15 min

      if (
        diffMin < -15 &&
        b.arrivalConfirmed === null &&
        b.status === 'confirmed'
      ) {
        console.log(" Auto-cancelling booking:", b._id.toString());
        b.status = 'cancelled';
        await b.save();
      }
    }

  } catch (err) {
    console.error(" Cron error:", err.message);
  }
});

console.log("Booking cron jobs loaded");
