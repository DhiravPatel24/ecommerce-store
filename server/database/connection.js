const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.DB_URI 

async function connectToDatabase() {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = { connectToDatabase };

