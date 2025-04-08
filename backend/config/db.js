const mongoose = require('mongoose');

const dbURL = process.env.DB_URL

const connectDB = async() =>{
    try{
        await mongoose.connect(dbURL)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDB;