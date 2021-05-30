const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    status:{
        type: Number,
        default: 0
    },
    deliveryPrice:{
        type: Number,
        required: true
    },
    assignedTo: {
        type: String,
        default: "No One is Assigned"
    },
    orderItems:[
        {
            itemId: String,
            selectedPriceIndex: Number,
            categoryName: String   
        }
    ],
    isPaid: Boolean,
    customerID:String
},{
    timestamps:{
         createdAt: 'created_at'
    }
});

const OrderItem = mongoose.model('OrderItem',OrderSchema);
module.exports = OrderItem;

