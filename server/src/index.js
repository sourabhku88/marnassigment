const express = require('express');
const mongoose = require('mongoose');
const router = require('./router/rout');
const cors = require('cors')

const PORT = 7800;

const app = express();

mongoose.connect('mongodb+srv://sourabh:sourabh@cluster0.s1xxn.mongodb.net/assigment').then(()=>console.log('Connected')).catch((err)=>console.log(err));

app.use(express.json());
app.use(cors());

app.use('/',router);

app.listen(PORT , ()=>{
    console.log(`server running on ${PORT}`);
})