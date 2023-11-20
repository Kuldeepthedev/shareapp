const express = require('express');
const userRoute = express.Router();
require('mongoose');
const User = require('../database/Userschema');
const nodemailer = require('nodemailer');
require('dotenv').config();
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const multer  = require('multer')
const DIR = './uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const  upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
userRoute.post('/sendotp', async (req, resp) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            resp.status(409).json("User Already Exists");
        } else {
            const transporter = await nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: 'choudharykuldeep20000@gmail.com',
                    pass: process.env.mail_pass,
                },
            });

            const _otp = Math.floor(Math.random() * 99999).toString();
            const info = await transporter.sendMail({
                from: 'choudharykuldeep20000@gmail.com',
                to: email,
                subject: "OTP verification",
                text: _otp,
                html: `<b>Here's your OTP to create an account: ${_otp}</b>`,
            });

            const Saveuser = await User.create({
                email: email,
                OTP: _otp,
                username: '',
                password: ''
            });
            resp.status(200).json(Saveuser.email);
        }
    } catch (error) {
        resp.status(400).json('Error');
    }
});

userRoute.post('/signup', async(req,resp)=>{
    const {username, otp, password,email} = req.body;
    try{
        const user = await User.findOne({username:username})
        if(user){
            resp.status(409).json("Username Already taken try with diffrent")
        }
        else{
        const verifyotp = await User.findOne({OTP:otp})
        if(verifyotp){
            const hashpassword = await bcrypt.hash(password,10)
            const result = await User.updateOne({email:email},{$set:{
                username:username,
                password:hashpassword,
                OTP:''
            }})
            resp.status(200).json(result)
        }
        else{
            resp.status(403).json("Invalid OTP")
        }
        }

        
    }
    catch(error){

    }
})

userRoute.post('/login', async(req,resp)=>{
    const {username, password} = req.body;
    try{
       const exituser =await User.findOne({username:username})
      if(!exituser){
        resp.status(402).json("User not ragistered Yet")
      }
      else {
      const matchpass = await bcrypt.compare(password,exituser.password)
      if(!matchpass){
        resp.status(403).json('Invalid Careditals')
      }
      else{
      resp.status(200).json(exituser)
      }
    }
}
    catch(error){
        resp.status(401).json("Failed to Login")
    }
})

userRoute.post('/forpass', async (req, resp)=>{
    const {email} = req.body
    try{
        const emailforforpass = User.findOne({email:email})
        if(!emailforforpass){
            resp.status(401).json("User not ragistered")
        }
    const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'choudharykuldeep20000@gmail.com',
            pass: process.env.mail_pass,
        },
    });

    const _otp = Math.floor(Math.random() * 99999).toString();
    const info = await transporter.sendMail({
        from: 'choudharykuldeep20000@gmail.com',
        to: email,
        subject: "OTP verification",
        text: _otp,
        html: `<b>Here's your OTP to Reset Your password: ${_otp}</b>`,
    });
       const saveotp = await User.updateOne({email:email},{$set:{OTP:_otp}})
      if(saveotp){
        resp.status(200).json(email)
      }
}
catch(error){
       resp.status(400).json('error while sending otp')
}
})
userRoute.post('/resetpass' ,async (req,resp)=>{
    const {email,password,OTP}= req.body
    try{
        const repassotp =await User.findOne({OTP:OTP})
        if(repassotp){
            resp.status.apply(403).json("Invalid Otp")

        }
        else{
            const hashpassword = await bcrypt.hash(password,10)
            const updatepass = await User.updateOne({email:email},{$set:{password:hashpassword,OTP:''}})
            if(updatepass){
                const updateotp = await User.updateOne({OTP:OTP},{$set:{OTP:''}})
                
                resp.status(200).json("password updated")
            }
        }

    }
    catch(error){
        resp.status(400).json("bad request")
    }
})

userRoute.post('/updateuser', upload.single('profile'), async (req, resp) => {
    const url = req.protocol + '://' + req.get('host')
    const { username, Fullname, Address, Mobile, Profession, Birthday } = req.body;
    let Image = url + '/uploads/' + req.file.filename
     
    
   
    try {
        const confirmuser = await User.findOne({ username: username });
        if (!confirmuser) {
            resp.status(403).json("User Not found");
        } else {
            const updateuser = await User.updateOne(
                { username: username },
                {
                    $set: {
                        Fullname: Fullname,
                        Address: Address,
                        Mobile: Mobile,
                        Profession: Profession,
                        Birthday: Birthday,
                        Image: Image
                    }
                }
            );
            if (updateuser) {
                let senddata = await User.findOne({username:username}).select("-password")
                if(senddata){
                   
                resp.status(200).json(senddata);
                }
            } else {
                resp.status(400).json("Failed to update user data");
            }
        }
    } catch (error) {
        resp.status(400).json("Bad request");
    }
});

module.exports = userRoute;
