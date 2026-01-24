const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    employeeId: String,
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'ibm-sso' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
