const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  otp_code: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    default: 'reset-password', // or 'register', 'login', etc.
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: true,
    index: { expires: '7d' }, // Optional: auto-clean after 7 days
  },
});

module.exports = mongoose.model('OtpVerification', otpVerificationSchema);
