const express = require('express');
const router = express.Router();
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const CategoryItem = require('../models/CategoryItem')
const admin = require("firebase-admin");
const DeliveryBoy = require('../models/DeliveryBoy')

function wasteTime(){
    for(let i=0;i<1000000000;i++){

    }
}

let deliveryPrice = 30;

// Get Delivery Price
router.get('/deliveryPrice',(req,res)=>{
    res.json(deliveryPrice);
})

// Set Delivery Price
router.post('/deliveryPrice',(req,res)=>{
    deliveryPrice = req.body.deliveryPrice;
    res.json(true);
})

// Get Upi Details
router.get('/upiDetails',(req,res)=>{
    res.json({
        upiName: "Prakhar Bhatt",
        upiId: "prakharbhatt2810@ybl"
    })
})

// TODO: create a order
router.post('/newOrder',async (req,res)=>{
    // TODO: get the user address and save it to user
    let { deliveryPrice, orderItems, isPaid, customerFCMID, userId, name, buildingName, mainAddress, landMark, pinCode } = req.body;
    const orderItem = new OrderItem({
        deliveryPrice: deliveryPrice,
        orderItems: orderItems,
        isPaid: isPaid,
        customerID: userId
    })

    // TODO: SEND NOTIFICATION TO ADMIN
    sendNotificationToAdmin("New Order Arrived","Hurry Up Look at the new order!!");

    try{
        const savedRes = await orderItem.save();
        const user = await User.findById({_id: userId});

        let orderedItems = user.orderedItems;
        orderedItems.push(savedRes._id)
        user.orderedItems = orderedItems;

        user.fcmID = customerFCMID;
        user.name = name;
        user.buildingName = buildingName;
        user.mainAddress = mainAddress;
        user.landMark = landMark;
        user.pinCode = pinCode;

        await user.save();

        res.json(true);
    }catch(error){
        res.sendStatus(500).send(error.message);
    }

})

// TODO: get all orders (User)
router.get('/user/:cutomerId',async (req,res)=>{

    const cutomerId = req.params.cutomerId;
    const results = [];

    try {
        const user = await User.findById({_id: cutomerId});

        for(let i=0;i<user.orderedItems.length;i++){
            let orderId = user.orderedItems[i];
            const orderItem = await OrderItem.findById({_id:orderId});
            
            let cartItems = []
            for(let j=0;j<orderItem.orderItems.length;j++){
                const currItem = orderItem.orderItems[j];
                const categoryItem = await CategoryItem.findOne({categoryName: currItem.categoryName,_id:currItem.itemId})
                

                cartItems.push({
                    ...categoryItem.toObject(),
                    ...currItem.toObject()
                });

            }

            const temp = {
                order_id: orderItem._id,
                order_date: orderItem.created_at,
                orderItems: cartItems,
                status: orderItem.status,
                deliveryPrice: orderItem.deliveryPrice
            }

            results.push(temp);
        }


        res.json(results);

    } catch (error) {
        res.sendStatus(500).send(error.message);
    }

    

})

// TODO: get all orders
router.get('/all',async (req,res)=>{
    const page = Number.parseInt(req.query.page);
    const limit = Number.parseInt(req.query.limit);
    const status = Number.parseInt(req.query.status);
    const skip = (page-1)*limit;

    let results = [];

    try{
        const orderItems = 
            await OrderItem.find({status: status})
            .limit(limit)
            .sort({created_at:-1})
            .skip(skip);
        
            for(let i=0;i<orderItems.length;i++){
                const orderItem = orderItems[i];

                let cartItems = []
                for(let j=0;j<orderItem.orderItems.length;j++){
                    const currItem = orderItem.orderItems[j];
                    const categoryItem = await CategoryItem.findOne({categoryName: currItem.categoryName,_id:currItem.itemId})
                    
                    cartItems.push({
                        ...categoryItem.toObject(),
                        ...currItem.toObject()
                    });
    
                }
                
                const temp = {
                    order_id: orderItem._id,
                    order_date: orderItem.created_at,
                    orderItems: cartItems,
                    status: orderItem.status,
                    deliveryPrice: orderItem.deliveryPrice,
                    customerID: orderItem.customerID,
                    assignedTo: orderItem.assignedTo
                }

                // console.log(temp);
                results.push(temp);
            }


        
        res.json(results);

    }catch(error){
        res.sendStatus(500).send(error.message);
    }

})

// TODO: Change order status
router.get('/changeStatus/:orderId',async (req,res)=>{
    const orderId = req.params.orderId;
    const status = Number.parseInt(req.query.status);
    const name = req.query.name;

    // TODO: send the notificaiton to user

    try {
        const orderItem = await OrderItem.findOne({_id: orderId});
        const user = await User.findOne({_id: orderItem.customerID});
        if(orderItem){
            orderItem.status = status;
            orderItem.assignedTo = name;
            await orderItem.save();

            if(status == 1){
                sendNotificationToUser("Your Order is Out For Delivery","Your laf ilafns lnfaslknklasn lnalfs n",user.fcmID);

                DeliveryBoy.findOne({name: name}).then((deliveryBoy)=>{

                    deliveryBoy.currentItems = [...deliveryBoy.currentItems,orderId];
                    deliveryBoy.save().then(()=>{
                        sendNotificationToUser("New Order","New Order Arrived For Delivery",deliveryBoy.fcmId);
                    })
    
                })

            }else if(status == 2){
                sendNotificationToUser("Your Order is Delivered","Your laf ilafns lnfaslknklasn lnalfs n",user.fcmID);
                sendNotificationToAdmin("Order Delivered!!","Order is Delivered By " + name);

                DeliveryBoy.findOne({name: name}).then((deliveryBoy)=>{
                    deliveryBoy.currentItems = deliveryBoy.currentItems.filter(curr => curr != orderId);
                    deliveryBoy.save();
    
                })
            }

            res.json(true);
        }
        
    } catch (error) {
        res.sendStatus(500).send(error.message);
    }


})

// sendNotificationToUser("hello","hi","c07QjAQgRaa_W7OkymmUIk:APA91bGe3ppLtndMpYECj8G7bgUVTYIdElORcGBB0N7cjYB4CGbTel8Y2AARLYvE2GtPXGi9fsoV5cjdtM0Xdn6UGCJOg5eoaqFzRv-3ygHpLpMBcGTpSx_Xoc27rT0zvj4OJ7zFiS6x")

function sendNotificationToUser(title,body,fcmID) {
	const message = {
		data:{
			title:title,
			body:body			
		},
		token: fcmID,
        android:{
            priority: "high"
        }
	}

	admin.messaging().send(message)
	  .then((response) => {
	    console.log('Successfully sent message to ' + "user", response);
	  })
	  .catch((error) => {
	    console.log('Error sending message to' + "user", error);
	  });	

}

function sendNotificationToAdmin(title,body) {
	const message = {
		data:{
			title:title,
			body: body		
		},
		topic:"admin",
        android:{
            priority: "high"
        }
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