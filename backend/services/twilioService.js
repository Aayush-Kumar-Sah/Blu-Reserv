const twilio = require('twilio');

const REQUIRED_ENV = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'FRONTEND_URL'
];

REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);
  }
});

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function formatPhone(phone) {
  if (!phone) return phone;
  if (phone.startsWith('+')) return phone;

  const rawCountryCode = process.env.SMS_DEFAULT_COUNTRY_CODE || '+91';

  const normalizedCountryCode = rawCountryCode.startsWith('+')
    ? rawCountryCode
    : `+${rawCountryCode}`;

  return `${normalizedCountryCode}${phone}`;
}

// Reminder SMS
async function sendReminderSMS(booking) {
  try {
    const phone = formatPhone(booking.customerPhone);

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    const yesLink = `${FRONTEND_URL}/booking/confirm/${booking._id}`;
    const noLink  = `${FRONTEND_URL}/booking/cancel/${booking._id}`;

    const msg = `Are you coming?\n\nYES: ${yesLink}\nNO: ${noLink}`;

    const res = await client.messages.create({
      body: msg,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log("📩 Reminder SMS sent:", res.sid);
    return true;   // success

  } catch (error) {
    console.error(" Reminder SMS failed:", error.message);
    return false;  //  failed
  }
}


// Time alert SMS
async function sendTimeAlertSMS(booking) {
  try {
    const phone = formatPhone(booking.customerPhone);

    const msg = `It's time.\nPlease reach the restaurant.`;

    const res = await client.messages.create({
      body: msg,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log("📩 Time alert SMS sent:", res.sid);
    return true;   // success

  } catch (error) {
    console.error("Time alert SMS failed:", error.message);
    return false;  //  failed
  }
}

module.exports = {
  sendReminderSMS,
  sendTimeAlertSMS
};
