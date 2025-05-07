const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const emailHelper = require("../utils/emailHelper");
require("dotenv").config({ path: "../.env" });
const privateKey = process.env.JWT_KEY;

const registerUser = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        const ExistingUser = await UserModel.findOne({email})

        if (ExistingUser){
            return res.status(400).json({
                message:'User already exists'
            })
        }

        //hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds)

        //If user does not exist, create a new user and save it to the database
        const newUser = new UserModel({
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

const loginUser = async (req, res) => {
  try {
    const { email, password: passwordFromClient } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exists. Please register.",
      });
    }
    

    const match = await bcrypt.compare(passwordFromClient, user.password);
    if (!match) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }


    const token = jwt.sign({ userId: user["_id"] }, privateKey, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "User logged in succesfully",
      data: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

const currentUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id);
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

const forgetPassword = async(req, res) => {
  try{
    const {email} = req.body;
    if(!email){
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email for forget Password"
      })
    }
    let user = await UserModel.findOne({email});
    if(!user){
      return res.status(401).json({
        status: "failure",
        message: "user not found"
      })
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now()+ 3*60*1000 ;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "otp send to your email"
    })
    await emailHelper("otp", user.email, {name: user.name, otp})

  }catch(err){
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

const resetPassword = async(req, res) => {
  try{
    let resetDetails = req.body;
    if(!resetDetails.password || !resetDetails.otp){
      return res.status(401).json({
        status: "failure",
        message: "invalid request"
      })
    }
    const user = await UserModel.findOne({otp: resetDetails.otp});
    if(!user){
      return res.status(401).json({
        status: "failure",
        message: "user not found"
      })
    }
    if(Date.now() > user.otpExpiry){
      return res.status(401).json({
        status: "failure",
        message: "otp expired"
      })
    }
    user.password = resetDetails.password;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "otp send to your email"
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}


function otpGenerator(){
  return Math.floor(Math.random()*1000000+9000000);
}



module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgetPassword, 
  resetPassword
};