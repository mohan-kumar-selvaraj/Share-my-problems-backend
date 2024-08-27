const mongoose = require('mongoose')

const user = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        dob: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        countryCode: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
)
const Users = mongoose.model('Users', user);

module.exports = Users;