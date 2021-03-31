const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
    imageURL:String,
    userId:String,
    completed:{
        type: Boolean,
        default: false
    }
},{
    timestamps:{
         createdAt: 'created_at'
    }
});


const PrescriptionItem = mongoose.model('PrescriptionItem',prescriptionSchema);
module.exports = PrescriptionItem;