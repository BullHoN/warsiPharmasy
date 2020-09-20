const express = require('express');
const path = require('path')

const app = express();

app.use('/',express.static('pages'))

app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','index.html'))
})

app.get('/about',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','aboutUs.html'))
})

app.get('/contact',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages','contactUs.html'))
})


app.listen(8000,()=>{
    console.log('server started at port 8000...')
})