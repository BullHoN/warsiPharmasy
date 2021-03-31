const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const app = express();
const compression = require('compression');

var admin = require("firebase-admin");
var serviceAccount = require("./config.json");

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


// Insert Dummy Data
// const User = require('./models/User');

// const user = new User({
//     phoneNo: "+919997403324",
//     otp: "1234",
//     isVerified: true
// }).save().then(()=>{
//     console.log('saved');
// })


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