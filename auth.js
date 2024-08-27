const OTPLessAuth = require('otpless-node-js-auth-sdk');
require('dotenv').config();

// Replace with your actual Client ID and Client Secret
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Method to send OTP
const sendOTP = async (phoneNumber, email, channel, hash, orderId, expiry, otpLength) => {
  try {
    const response = await OTPLessAuth.sendOTP(phoneNumber, email, channel, hash, orderId, expiry, otpLength, clientId, clientSecret);
    console.log("sendOTP response:", response);
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Method to resend OTP
const resendOTP = async (orderId) => {
  try {
    const response = await OTPLessAuth.resendOTP(orderId, clientId, clientSecret);
    console.log("resendOTP response:", response);
    return response;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};

// Method to verify OTP
const verifyOTP = async (email, phoneNumber, orderId, otp) => {
  try {
    const response = await OTPLessAuth.verifyOTP(email, phoneNumber, orderId, otp, clientId, clientSecret);
    console.log("verifyOTP response:", response);
    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

module.exports = { sendOTP, resendOTP, verifyOTP };
