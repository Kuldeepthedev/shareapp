const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
   PostId: {type:String},
   Like: {type:String}
},{timestamps:true}  )

module.exports = mongoose.model('postlikes',UserSchema)