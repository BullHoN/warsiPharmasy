const mongoose = require('mongoose');

const deliveryBoySchema = mongoose.Schema({
	name:String,
	fcmId:String,
	isOnline:{
		type:Boolean,
		default:true
	},
	count:{
		type:Number,
		default:0
	},
	currentItems:[String]
});

const DeliveryBoy = mongoose.model('DeliveryBoy',deliveryBoySchema);

module.exports = DeliveryBoy;