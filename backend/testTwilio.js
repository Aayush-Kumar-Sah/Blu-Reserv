require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

client.messages.create({
  body: '✅ Test message from Blu-Reserv system!',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: '+919538501947'   // your verified phone number
})
.then(msg => console.log('Message sent:', msg.sid))
.catch(err => console.error('Twilio error:', err));
