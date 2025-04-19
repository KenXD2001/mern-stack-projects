const express = require('express');
const router = express.Router();
const { register, login, verifyUser, sendOtp, verifyOtp, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-user', verifyUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
