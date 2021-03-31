const express = require('express');
const multer = require('multer');
const PrescriptionItem = require('../models/PrescriptionItem');
const router = express.Router();
const admin = require("firebase-admin");

let storage = multer.diskStorage({
    destination: './uploads',
    filename: function(req,file,cb){
        return cb(null,file.originalname)
    }
})

const upload = multer({storage: storage});


// TODO: upload prescription route
router.post('/upload',upload.single('upload'),async (req,res)=>{

    const { userId, imageName } = JSON.parse(req.body.data);

    // TODO: Send Notification
    sendNotificationToAdmin();

    try {
        const imageURL = process.env.DOMAIN + "uploads/" + imageName; 

        const prescriptionItem = new PrescriptionItem({
            userId: userId,
            imageURL: imageURL
        })
    
        await prescriptionItem.save();
        res.json(true);        

    } catch (error) {
        res.sendStatus(500).send(error.message);
    }


})

// TODO: get prescription route
router.get('/getAll', async (req,res)=>{

    try {
        const prescriptionItems = await PrescriptionItem.find({completed: false});
        res.json(prescriptionItems);
    } catch (error) {
        res.sendStatus(500).send(error.message);
    }

})

// update prescription route
router.get('/update/:presId', async (req,res)=>{
    const presID = req.params.presId

    try {
        const prescriptionItem = await PrescriptionItem.findById({_id: presID});
        prescriptionItem.completed = true;
        await prescriptionItem.save();
        res.json(true);

    } catch (error) {
        res.sendStatus(500).send(error.message);
    }

})


function sendNotificationToAdmin() {
	const message = {
		data:{
			title:"New Prescription arrived",
			body:"Hurry up look at new prescription"			
		},
		topic:"admin"
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent message to ' + "admin", response);
	  })
	  .catch((error) => {
	    console.log('Error sending message to' + "admin", error);
	  });	

}

module.exports = router;