/*const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: booking.customerPhone.startsWith('+')
  ? booking.customerPhone
  : `+91${booking.customerPhone}`,

    });
    console.log('📩 SMS sent to', to);
  } catch (err) {
    console.error('❌ SMS error:', err.message);
  }
};

module.exports = { sendSMS };
*/

const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function formatPhone(phone) {
  if (phone.startsWith('+')) return phone;
  return `+91${phone}`;
}

// 📩 Reminder SMS
async function sendReminderSMS(booking) {
  const phone = formatPhone(booking.customerPhone);

  const yesLink = `${process.env.FRONTEND_URL}/booking/confirm/${booking._id}`;
  const noLink  = `${process.env.FRONTEND_URL}/booking/cancel/${booking._id}`;

  const msg = `Are you cominggg?\n\nYES: ${yesLink}\nNO: ${noLink}`;

  const res = await client.messages.create({
    body: msg,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });

  console.log("📩 Reminder SMS sent:", res.sid);
}

// ⏰ Time alert SMS
async function sendTimeAlertSMS(booking) {
  const phone = formatPhone(booking.customerPhone);

  const msg = `Its timeee.\nPlease reach the restaurant.`;

  const res = await client.messages.create({
    body: msg,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });

  console.log("📩 Time alert SMS sent:", res.sid);
}

// ✅ EXPORTS
module.exports = {
  sendReminderSMS,
  sendTimeAlertSMS
};
