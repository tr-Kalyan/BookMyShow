const mongoose = require('mongoose');

//user account schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        email:['admin','user','partner'],
        required:true,
        default:"user"
    }
},{timestamps: true})

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;