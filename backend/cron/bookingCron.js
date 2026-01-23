
const cron = require('node-cron');
const Booking = require('../models/Booking');
const { sendReminderSMS, sendTimeAlertSMS } = require('../services/twilioService');
const { sendReminderEmail, sendTimeAlertEmail, sendCancelEmail } = require('../services/emailService');

const CRON_VERBOSE = process.env.CRON_VERBOSE === 'true';

function cronLog(...args) {
  if (CRON_VERBOSE) {
    console.log('[CRON]', ...args);
  }
}

console.log(" Booking cron loaded");

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    cronLog("Tick:", now.toISOString());

    //  Only fetch relevant bookings (scalable query)
    const bookings = await Booking.find({
      status: 'confirmed',
      bookingDateTime: {
        $gte: new Date(now.getTime() - 30 * 60 * 1000), // past 30 min
        $lte: new Date(now.getTime() + 30 * 60 * 1000)  // next 30 min
      }
    });

    for (let b of bookings) {
      if (!b.bookingDateTime) continue;

      const bookingTime = new Date(b.bookingDateTime);
      const diffMs = bookingTime.getTime() - now.getTime();
      const diffMin = Math.floor(diffMs / 60000);

      cronLog("Booking:", b._id.toString(), "diffMin:", diffMin);

      // =========================
      //  Reminder (10–5 min window)
      // =========================
      if (diffMin <= 10 && diffMin > 5 && !b.reminderSent) {

        let sent = false;

        if (b.notificationPreference === 'sms' || b.notificationPreference === 'both') {
          const smsOk = await sendReminderSMS(b);
          sent = sent || smsOk;
        }

        if (b.notificationPreference === 'email' || b.notificationPreference === 'both') {
          const emailOk = await sendReminderEmail(b);
          sent = sent || emailOk;
        }

        //  Only mark if something actually sent
        if (sent) {
          b.reminderSent = true;
          await b.save();
          console.log("Reminder sent:", b._id.toString());
        } else {
          console.log(" Reminder failed, not marking sent:", b._id.toString());
        }
      }

      // =========================
      // Time Alert (2 min before to 1 min after)
      // =========================
      if (diffMin <= 2 && diffMin >= -1 && !b.timeAlertSent) {

        let sent = false;

        if (b.notificationPreference === 'sms' || b.notificationPreference === 'both') {
          const smsOk = await sendTimeAlertSMS(b);
          sent = sent || smsOk;
        }

        if (b.notificationPreference === 'email' || b.notificationPreference === 'both') {
          const emailOk = await sendTimeAlertEmail(b);
          sent = sent || emailOk;
        }

        if (sent) {
          b.timeAlertSent = true;
          await b.save();
          console.log("Time alert sent:", b._id.toString());
        } else {
          console.log("Time alert failed, not marking sent:", b._id.toString());
        }
      }

      // =========================
      //  Auto-cancel after 15 min
      // =========================
      if (diffMin < -15 && b.arrivalConfirmed === null && b.status === 'confirmed') {

        b.status = 'cancelled';
        await b.save();

        const emailOk = await sendCancelEmail(b);

        if (emailOk) {
          console.log(" Auto-cancelled booking + email:", b._id.toString());
        } else {
          console.log("Auto-cancelled booking but email failed:", b._id.toString());
        }
      }
    }

  } catch (err) {
    console.error("Cron error:", err.message);
  }
});
