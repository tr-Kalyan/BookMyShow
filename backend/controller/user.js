const userModel = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
require('dotenv').config({path:'../.env'})
const privateKey = process.env.JWT_KEY

const registerUser = async (req,res) =>{
    try{
        const {email,password} = req.body;

        const ExistingUser = await userModel.findOne({email})

        if (ExistingUser){
            return res.status(400).json({
                message:'User already exists'
            })
        }

        //hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds)

        //If user does not exist, create a new user and save it to the database
        const newUser = new userModel({
            ...req.body,
            password:hashedPassword
        });
        await newUser.save()

        res.status(201).json({
            message:'User registered successfully',
        })

    }
    catch(err){
        console.log(err),
        res.status(500).json({
            message:err.message
        })
    }
}


const loginUser = async (req,res) => {
    try{

        const {email,password:passwordFromClient} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(401).json({
                message:'Invalid credentials'
            })
        }

        //compare the password with hashedPassword from database
        const isMatch = await bcrypt.compare(passwordFromClient,user.password);

        if(!isMatch){
            return res.status(401).json({
                message:"invalid credentials"
            })
        }

        const token = jwt.sign({userId:user["_id"]},privateKey,{expiresIn:"1d"});

        return res.status(200).json({
            message:"User logged in successfully",
            data:token
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}


const currentUser = async (req, res) => {
    try {

        const { id } = req.body;
        const user = await userModel.findById(id);

        if (user) {
            return res.status(200).json({
            message: "User details",
            data: user,
            });
        } else {
            return res.status(400).json({
            message: "User not found",
            });
        }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
};

module.exports={
    registerUser,
    loginUser,
    currentUser
}