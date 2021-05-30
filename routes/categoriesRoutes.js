const express = require('express');
const CategoryItem = require('../models/CategoryItem');
const router = express.Router();

function wasteTime(){
    for(let i=0;i<1000000000;i++){

    }
}

// TODO: Get All The Categories
const categories = ['tablets','syrup','injection','babycare','chyawanprash','oil','condom','otcproduct','proteinpowder'
,'whoors','vetnary','sportssurgical','ointmentandgel','powdersachet','toothpaste','facewash','rotacapinhalers','diapersandsanitarypads','soap','shampoo','eyedrop'];
router.get('/',(req,res)=>{
    res.json(categories);
})

// TODO: Get the single category (Pagination)
// /category/tables/page=2&items=5
router.get('/category/:categoryName',async (req,res)=>{

    // wasteTime();

    const categoryName = req.params.categoryName;

    const page = Number.parseInt(req.query.page);
    const limit = Number.parseInt(req.query.limit);
    const skip = (page-1)*limit;

    
    // console.log(categoryName);

    try{
        const categoryItems = 
            await CategoryItem.find({categoryName:categoryName})
                .limit(limit)
                .skip(skip);
        
        res.json(categoryItems);
    }catch (error){
        res.sendStatus(500).send(error.message);
    }
})

// TODO: Search for a Product (may have category)
router.get('/all',async (req,res)=>{

    // wasteTime();

    const category = req.query.category;
    const page = Number.parseInt(req.query.page);
    const limit = Number.parseInt(req.query.limit);
    let query = req.query.query;
    const skip = (page-1)*limit;

    const admin = req.query.admin ? true : false;
    
    // show all items
    if(admin){
        if(category){
            try{
                const items = 
                    await CategoryItem.find({categoryName: {$regex: category},itemName: { $regex: query} })
                        .limit(limit)
                        .skip(skip)
                    
                    res.json(items);
        
            }catch(error){
                res.sendStatus(500).send(error.message);
            }
        }else{
            try{
                const items = 
                    await CategoryItem.find({
                            $or: [
                                {itemName: { $regex: query }},
                                {categoryName: { $regex: query }} 
                            ]
                        })
                        .limit(limit)
                        .skip(skip)
                    
                    res.json(items);
        
            }catch(error){
                res.sendStatus(500).send(error.message);
            }
        }

        return;
    }


    // show only available items
    if(category){
        try{
            const items = 
                await CategoryItem.find({categoryName: category,isAvailable:true,itemName: { $regex: query} })
                    .limit(limit)
                    .skip(skip)
                
                res.json(items);
    
        }catch(error){
            res.sendStatus(500).send(error.message);
        }
    }else{
        try{
            const items = 
                await CategoryItem.find({
                        $or: [
                            {itemName: { $regex: query }},
                            {categoryName: { $regex: query }} 
                        ],
                        isAvailable:true
                    })
                    .limit(limit)
                    .skip(skip)
                
                res.json(items);
    
        }catch(error){
            res.sendStatus(500).send(error.message);
        }
    }


})

// TODO: Get the top selling items
router.get('/topSelling',async (req,res)=>{
    // wasteTime();
    try{
        const topSellingItems = 
            await CategoryItem.find({isAvailable:true})
            .sort({discount: -1})
            .limit(5);

        res.json(topSellingItems);        

    }catch(error){
        res.sendStatus(500).send(error.message);
    }
})

//TODO: Recommendation Item


// TODO: Decide Admin Routes
router.post('/changeItem',async (req,res)=>{
    let { _id, discount, isAvailable } = req.body;
    discount = Number.parseInt(discount);

    try {
        console.log(discount);
        const item = await CategoryItem.findById({_id:_id});
        item.isAvailable = isAvailable;
        item.discount = discount;

        await item.save();

        res.json(true);
    } catch (error) {
        res.sendStatus(500).send(error.message);
    }

})


module.exports = router;