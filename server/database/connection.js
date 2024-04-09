const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb+srv://dpdemo24:Dhirav123%40@product.xgjevf5.mongodb.net/Product?retryWrites=true&w=majority&appName=Product');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = { connectToDatabase };

