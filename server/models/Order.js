const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    unit_amount:{
        type: Number
    },
    quantity:{
        type: Number
    },
    item:{
        type:Array
    },
    totalprice:{
        type: Number
    }
    
   
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
