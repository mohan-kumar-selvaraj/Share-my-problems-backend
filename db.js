const mongoose = require("mongoose");
require('dotenv').config();

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.syzbimn.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

async function connectDB() {
    try {
        await mongoose.connect(url);
        console.log("Mongoose connected successfully!");
    } catch (err) {
        console.log(err);
    }
}

connectDB();

module.exports = mongoose;
