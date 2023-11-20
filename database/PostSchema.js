const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
   username: {type:String},
   Description: {type: String},
   Postimage: {type:String},
   Profileimage:{type:String},
   Like:{type:Number},
   Save:{type:Number},
   Likeby:[{type:String}],
   Saveby:[{type:String}],
   Comment:[{
      comment:{type:String},
      username:{type:String},
      Profileimage:{type:String},
      date:{type:Date}
   }]
},{timestamps:true}  )

module.exports = mongoose.model('userposts',UserSchema)