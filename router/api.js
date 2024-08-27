const router = require("express").Router();
const mongoose = require('mongoose')
const db = require("../db");
const { sendOTP, resendOTP, verifyOTP } = require('../auth');
const OTPDetails = require('../models/OTPDetails')
const Users = require('../models/users')
const Problems = require('../models/problems')

// find the username present in the mongodb or not
router.get("/username/search", async (req, res) => {
    try {
      const { username } = req.query;
      if (username != undefined) {
        const user = await Users.findOne({ username: username });
        if (user) {
          res.json({ status: "SUCCESS", message: "Username found" });
        } else {
          res.json({ status: "FAILED", message: "Username not found" });
        }
      }
    } catch (error) {
      res.json({status : "FAILED" ,  message: error.message });
    }
});

// find the username present in the mongodb or not
router.get("/user/check", async (req, res) => {
    try {
      const { phoneNumber } = req.query;
      if(!phoneNumber) throw new Error("Please provide the phone number");
        const user = await Users.findOne({ phoneNumber });
        if (user) {
          res.json({ status: "SUCCESS", message: "Profile already exists" });
        } else {
          res.json({ status: "FAILED", message: "Profile not found" });
        }
    } catch (error) {
      res.json({status : "FAILED" ,  message: error.message });
    }
});

// create user profile to mongodb
router.post("/user/create", async (req, res) => {
    try {
      const {username, name, dob, gender, location, phoneNumber, countryCode, image = "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png"} = req.body;
      if(!username || !name || !dob || !gender || !location || !phoneNumber || !countryCode || !image) {
        throw new Error("Empty details are not allowed");
      }
      const check = await Users.findOne({ phoneNumber });
      if (check) {
         throw new Error("Profile already exists" );
      }
      const user = await Users.create({username, name, dob, gender, location, phoneNumber, countryCode, image});
      res.json({status:"SUCCESS", message : "Account created successfully"});
    } catch (error) {
      console.log(error);
      res.json({ status : "FAILED",message: error.message });
    }
});

// create problem to mongodb
router.post("/problem/create", async (req, res) => {
  try {
    const {userId, title, workSphere, category, minBudget, maxBudget, description, expiryDate, bidsCount = 0, totalPages = 0} = req.body;
    if(!userId || !title || !workSphere || !category || !minBudget || !maxBudget || !description || !expiryDate) {
      throw new Error("Empty details are not allowed");
    }
    const problem = await Problems.create({userId, title, workSphere, category, minBudget, maxBudget, description, bidsCount, expiryDate, totalPages});
    res.json({status:"SUCCESS", message : "Problem created successfully"});
  } catch (error) {
    console.log(error);
    res.json({ status : "FAILED",message: error.message });
  }
});

// update problem to mongodb
router.post("/problem/update", async (req, res) => {
  try {
    const {userId, problemId, title, workSphere, category, minBudget, maxBudget, description, expiryDate, bidsCount = 0, totalPages = 0} = req.body;
    if(!userId || !problemId || !title || !workSphere || !category || !minBudget || !maxBudget || !description || !expiryDate) {
      throw new Error("Empty details are not allowed");
    }
    const filter = {_id : problemId, userId}
    const update = {userId, title, workSphere, category, minBudget, maxBudget, description, bidsCount, expiryDate, totalPages};
    const problem = await Problems.updateOne(filter, { $set: update });
    res.json({status:"SUCCESS", message : "Problem updated successfully"});
  } catch (error) {
    console.log(error);
    res.json({ status : "FAILED",message: error.message });
  }
});

// delete problem from mongodb
router.post("/problem/delete", async (req, res) => {
  try {
    const {problemId} = req.body;
    if(!problemId) {
      throw new Error("Please provide the problem id");
    }
    const problem = await Problems.deleteMany({_id : new mongoose.Types.ObjectId(problemId)});
    res.json({status:"SUCCESS", message : "Problem deleted successfully"});
  } catch (error) {
    console.log(error);
    res.json({ status : "FAILED",message: error.message });
  }
});

// Route to send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { countryCode, phoneNumber, email = "", channel = "SMS", hash = "", orderId="", expiry = 300, otpLength = '6'} = req.body;
        if(!phoneNumber ) {
          throw new Error("Please enter the phone number");
        }
        if(!countryCode ) {
          throw new Error("Please check the country code");
        }
        const response = await sendOTP(countryCode+phoneNumber, email, channel, hash, orderId, expiry, otpLength);
        if(response['success']==false) throw new Error(response['errorMessage']);
        await OTPDetails.deleteMany({phoneNumber});
        const result = await OTPDetails.create({
            phoneNumber,
            countryCode, 
            orderId : response["orderId"], 
            createdAt : new Date(Date.now()), 
            expireAt : new Date(Date.now() + (300000)) // 300000 - 5 mins && 3600000 ms = 60 mins
        });
        res.json({status: "SUCCESS", message: "OTP sent successfully"});
    } catch (error) {
        console.log(error);
        res.json({status: "FAILED", message: error.message });
    }
});
  
// Route to resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if(!phoneNumber) throw new Error("Please provide the phone number");
        const UserOtpVerificationRecord = await OTPDetails.find({phoneNumber});
        if( UserOtpVerificationRecord.length <= 0) {
            throw new Error(
              "Record not found or you have already verified"
            )
        }
        const orderId = UserOtpVerificationRecord[0].orderId;
        const response = await resendOTP(orderId);
        if(response['success']==false) throw new Error(response['errorMessage']);
        res.json({status: "SUCCESS", message: "OTP sent successfully"});
    } catch (error) {
        console.log(error);
        res.json({status: "FAILED", message: error.message });
    }
});
  
// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email = "", phoneNumber, countryCode, otp } = req.body;
        if(!phoneNumber ) {
            throw new Error("Please enter the phone number");
        }
        if(!otp) {
            throw new Error("Please enter the OTP");
        }
        const UserOtpVerificationRecord = await OTPDetails.find({phoneNumber});
        if( UserOtpVerificationRecord.length <= 0) {
            throw new Error(
              "Record not found or you have already verified"
            )
        }
        const orderId = UserOtpVerificationRecord[0].orderId;
        const response = await verifyOTP(email, countryCode+phoneNumber, orderId, otp);
        if(response['isOTPVerified']==false) throw new Error(response['reason']);
        await OTPDetails.deleteMany({phoneNumber});
        res.json({status: "SUCCESS", message: "OTP verified successfully"});
    } catch (error) {
        console.log(error);
        res.json({status: "FAILED", message: error.message });
    }
});

module.exports = router;