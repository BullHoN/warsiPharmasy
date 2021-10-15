const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const app = express();
const compression = require('compression');

var admin = require("firebase-admin");
var serviceAccount = require("./config.json");

// New Comment

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// middlewares
app.use(compression({
    level: 6
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
require('dotenv').config();

// MongoDB Setup
connectDB();

// routes
app.use('/uploads',express.static('uploads'));
app.use('/',express.static('pages'));
app.use('/categories',require('./routes/categoriesRoutes'));
app.use('/order',require('./routes/orderRoutes'));
app.use('/auth',require('./routes/authRoutes'));
app.use('/prescription',require('./routes/prescriptionRoutes'));
app.use('/delivery',require('./routes/deliveryBoyRoutes'));


// Insert Dummy Data
// const CategoryItem = require('./models/CategoryItem');
// for(let i=0;i<20;i++){
//     const categoryItem = new CategoryItem({
//         itemName: `Benadryl cough syrup ${i}`,
//         categoryName: "syrups",
//         discount: Math.floor(Math.random() * 99),
//         priceItems: [
//             {
//                 priceTag: "200ml",
//                 price: 200
//             },
//             {
//                 priceTag: "250ml",
//                 price: 750
//             },
//             {
//                 priceTag: "500ml",
//                 price: 860
//             },
//         ]
//     }).save();
// }

// add delivery Boys
// const DeliveryBoy = require('./models/DeliveryBoy');
// const deliveryBoy = new DeliveryBoy({
//     name: "Prakhar",
//     fcmId: "asfaf asd as fsaf ",
//     phoneNo: "is doiisd fjiojs fjiosdfjis dfijfjfj"
// }).save();

// load data script
const path  = require('path');
const csvPath = path.resolve(__dirname,'data','temp.csv');
const importDataFromCSV = require('./utils/loadData')

// importDataFromCSV(csvPath);


// Main Page Routes
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','index.html'))
})

app.get('/about',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','aboutUs.html'))
})

app.get('/services',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','services.html'))
})

app.get('/gallery',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','gallery.html'))
})

app.get('/contact',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','contactUs.html'))
})


app.listen(process.env.PORT,()=>{
    console.log(`server started at port ${process.env.PORT}...`)
})