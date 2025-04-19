const User = require('../models/User');
const OtpVerification = require('../models/OtpVerification');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to get current timestamp
const getTimestamp = () => {
  return new Date().toISOString(); // This gives you a standard ISO format: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log(`[${getTimestamp()}] Received register request with:`, { name, email });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log(`[${getTimestamp()}] User already exists with email: ${email}`);
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`[${getTimestamp()}] Password hashed for user: ${email}`);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();
    console.log(`[${getTimestamp()}] User registered successfully: ${email}`);
    res.status(201).json({ msg: "User registered successfully" });

  } catch (err) {
    console.error(`[${getTimestamp()}] Error during registration:`, err);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`[${getTimestamp()}] Received login request with:`, { email });

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`[${getTimestamp()}] No user found with email: ${email}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[${getTimestamp()}] Invalid credentials for email: ${email}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    console.log(`[${getTimestamp()}] Login successful for email: ${email}`);

    res.json({ token });

  } catch (err) {
    console.error(`[${getTimestamp()}] Error during login:`, err);
    res.status(500).send("Server Error");
  }
};

// Verify if the user exists before sending OTP
exports.verifyUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User with this email not found" });
    }

    // If the user exists, send a success response
    return res.status(200).json({ msg: "User verified successfully" });

  } catch (err) {
    console.error(`[${getTimestamp()}] Error verifying user:`, err);
    return res.status(500).send("Server Error");
  }
};

// In-memory store (use Redis in production)
let otpStore = {};

// Send OTP
exports.sendOtp = async (req, res) => {
  const { email, purpose = 'resetPassword' } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User with this email not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const now = new Date();

    // Save OTP in DB with expiration
    const otpEntry = new OtpVerification({
      user_email: email,
      otp_code: otp,
      purpose,
      expires_at: new Date(now.getTime() + 2 * 60 * 1000), // 2 minutes expiration
    });

    await otpEntry.save();
    console.log(`[${getTimestamp()}] OTP for ${email}: ${otp}`);

    // TODO: Send OTP via email/SMS
    return res.status(200).json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error(`[${getTimestamp()}] Error sending OTP:`, err);
    return res.status(500).send("Server Error");
  }
};



// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp, purpose = 'resetPassword' } = req.body;

  try {
    const otpRecord = await OtpVerification.findOne({
      user_email: email,
      otp_code: otp,
      purpose
    });

    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (otpRecord.is_verified) {
      return res.status(400).json({ msg: "OTP already used" });
    }

    if (new Date() > otpRecord.expires_at) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    otpRecord.is_verified = true;
    await otpRecord.save();

    console.log(`[${getTimestamp()}] OTP verified for ${email}`);
    return res.status(200).json({ msg: "OTP verified successfully" });

  } catch (err) {
    console.error(`[${getTimestamp()}] Error verifying OTP:`, err);
    return res.status(500).send("Server Error");
  }
};



// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  try {
    // Verify OTP first
    const otpRecord = await OtpVerification.findOne({
      user_email: email,
      otp_code: otp,
      purpose: 'resetPassword'
    });

    if (!otpRecord || !otpRecord.is_verified) {
      return res.status(400).json({ msg: "OTP is not verified" });
    }

    // Ensure OTP is not expired
    if (new Date() > otpRecord.expires_at) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`[${getTimestamp()}] Password reset successful for ${email}`);
    return res.status(200).json({ msg: "Password reset successfully" });

  } catch (err) {
    console.error(`[${getTimestamp()}] Error resetting password:`, err);
    return res.status(500).send("Server Error");
  }
};



