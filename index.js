const express = require('express');
const cors = require('cors')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { connection } = require('./config/db');
const {UserModel} = require('./model/userModel');
const { default: mongoose } = require('mongoose');

const app = express();
mongoose.set('strictQuery',true)
app.use(express.json());
app.use(cors({
    origin:'*'
}));
app.post("/signup",async(req,res)=>{
    const {name,email,password} = req.body;
    const checkMail = await UserModel.find({email});
    console.log(checkMail)
    if(checkMail.length>0){
        res.send({msg:"Email already exist"});
    }else{
        try {
            const new_user = new UserModel({name,email,password})
            await new_user.save();
            res.send({ msg: "Registration success" });
        } catch (error) {
            console.log(error);
            res.send({err:"Registration failed"})
        }
    }
});
app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const checkMail = await UserModel.find({email,password});
        console.log(checkMail)
        if(checkMail.length>0){
            const token = jwt.sign({id:checkMail[0]._id},process.env.key);
            res.send({ msg: "Login Successfull", token: token })
        }else{
            res.send({ err: "Enter correct credentials" });
        }
    } catch (error) {
        
    }
});
app.get("/calculator",(req,res)=>{
    const {investment_amount,annual_intrest,total_year}= req.body;
    let p = Number(investment_amount);
    let n = Number(total_year);
    let i = Number(annual_intrest);
    let total_investment = p * n;
    i = (i/100);
    let temp = ((i+1) ** n)-1;
    temp = temp/i;
    temp = temp * p;
    
    let F = Math.round(temp - total_investment)
    res.send({result:F});
    
})
app.listen(process.env.port, async()=>{
    try {
        await connection;
        console.log('connected to database',process.env.port)
    } catch (error) {
        console.log(error);
        console.log("Database is not responding");
    }
})