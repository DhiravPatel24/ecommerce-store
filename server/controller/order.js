const Order = require('../models/Order.js'); 

 async function orderdetails (req, res, next) {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();
        console.log(orders)
        res.status(200).json(orders);
    } catch (error) {
        // Handle errors
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};



module.exports = {orderdetails}

