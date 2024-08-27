const mongoose = require('mongoose')

const problem = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Users' // Assuming you have a User model
          },
        title: {
            type: String,
            required: true
        },
        workSphere: {
            type: String,
            required: true
        },
        category: {
            type: [String], // Define the type of elements in the array
            required: true
        },
        minBudget: {
            type: Number,
            required: true
        },
        maxBudget: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        bidsCount: {
            type: Number,
            required: true,
            default: 0 // Provide a default value if bids count is 0 initially
        },
        expiryDate: {
            type: Date,
            required: true
        },
        totalPages: {
            type: Number,
            default: 0 // Provide a default value if totalPages is optional
        }
    },
    {
        timestamps: true // Automatically manage createdAt and updatedAt fields
    }
)
const Problems = mongoose.model('Problems', problem);

module.exports = Problems;