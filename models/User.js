const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  phoneNo: String,
  orderedItems: [String],
  otp: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  name:String,
  buildingName:String,
  mainAddress:String,
  landMark:String,
  fcmID:String,
  pinCode:String
});


const User = mongoose.model('User',UserSchema);
module.exports = User;