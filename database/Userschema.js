
const mongoose = require("mongoose")
const UserSchema = mongoose.Schema({
    username : {type:String},
    OTP: {type:String},
    email: {type:String},
    password:{type:String},
    Fullname:{type:String},
    Address:{type:String},
    Mobile:{type:String},
    Profession:{type:String},
    Birthday:{type:String},
    Image:{type:String
       
    }

},{timestamps:true}  )

module.exports = mongoose.model('users',UserSchema)