const express = require('express');
const DeliveryBoy = require('../models/DeliveryBoy');
const CategoryItem = require('../models/CategoryItem');
const OrderItem = require('../models/OrderItem');
const router = express.Router();

router.get('/allDeliveryBoys',async (req,res)=>{
    const result = await DeliveryBoy.find({isOnline: true});
    let results = [];
    result.forEach((item)=>{
        results.push(item.name);
    })
    res.json(results);
})

router.get('/getOrderItems',async (req,res)=>{

    const name = req.query.name;
    const deliveryBoy = await DeliveryBoy.findOne({name: name});
    const fcmID = req.query.fcmId;

    // console.log("hvhv",fcmID);

    let results = [];
    if(deliveryBoy){
        for(let i=0;i<deliveryBoy.currentItems.length;i++){
            let orderId = deliveryBoy.currentItems[i];

            const orderItem = await OrderItem.findOne({_id:orderId,status: 1});

            if(orderItem == null) continue;

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


            results.push(temp);
            deliveryBoy.fcmId = fcmID;
            deliveryBoy.save();
        }
    }else{
        const nwDeliveryBoys = new DeliveryBoy({
            name: name,
            fcmId: fcmID
        });

        await nwDeliveryBoys.save();
    }


    res.json(results);
})


module.exports = router;