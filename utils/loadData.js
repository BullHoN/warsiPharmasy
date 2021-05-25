const csv=require('csvtojson')
const CategoryItem = require('../models/CategoryItem');

function importDataFromCSV(filePath){
    csv()
    .fromFile(filePath)
    .then(async (items)=>{
        console.log(items.length);
        let n = items.length;
    
        items.forEach((item)=>{
            const priceTags = item.Tags.split(',');
            const prices = item.PriceTags.split(',');
    
            let priceItems = [];
            for(let i=0;i<priceTags.length;i++){
                priceItems.push({
                    priceTag: priceTags[i],
                    price: parseInt(prices[i])
                })
            }
    
            const categoryItem = new CategoryItem({
                itemName: item.ItemName,
                categoryName: item.Category,
                priceItems: priceItems
            }).save().then(()=>{
                n--;
                console.log(n);
            })
    
        }) 
    })
}

module.exports = importDataFromCSV;