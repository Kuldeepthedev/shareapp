const mongoose = require('mongoose')
require('dotenv').config()

const dbconnect = async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        
        console.log("connected to databse")
    }
    catch(error){
        console.log("Error connecting to the databse")
    }
}
module.exports = dbconnect; 