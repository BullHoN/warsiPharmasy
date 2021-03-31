const express = require('express');
const router = express.Router();
const User = require('../models/User')
const sendOtp = require('./sendOtp')

// TODO: Otp Request
router.post('/requestOtp/:phoneNo',async (req,res)=>{
    
    const phoneNo = req.params.phoneNo;
    const otp = generateOTP();

    console.log(otp);
    let user = await User.findOne({phoneNo: phoneNo})
    
    // TODO: Send OTP
    sendOtp(phoneNo,otp);

    if(user){
        user.otp = otp;
        await user.save();
        res.json(user._id);
    }else{
        user = new User({
            phoneNo: phoneNo,
            otp: otp
        });
        user = await user.save();
        res.json(user._id);
    }

})

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


// TODO: Verify Otp
router.post('/verifyOtp',async (req,res)=>{
    const { userId, otp } = req.body;

    const user = await User.findById({_id: userId});
    if(user && user.otp == otp){
        user.isVerified = true;
        await user.save();
        res.json(true);
    }else{
        res.json(false);
    }

})


router.get('/details/:userId',async (req,res)=>{
    const userId = req.params.userId;

    try {
        const user = await User.findOne({_id: userId});
        if(user){
            res.json(user);
        }
        
    } catch (error) {
        res.sendStatus(500).send(error.message);
    }


})

module.exports = router;