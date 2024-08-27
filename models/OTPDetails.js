const mongoose = require('mongoose')

const OTPDetails = mongoose.Schema(
    {
        phoneNumber : String,
        countryCode : String,
        orderId : String,
        createdAt : Date,
        expireAt : Date
    }
)

const OTP = mongoose.model("OTPDetails",OTPDetails)
module.exports = OTP;