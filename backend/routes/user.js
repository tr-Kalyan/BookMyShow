const express = require('express');
const {registerUser, loginUser,currentUser }  = require('../controller/user.js')
const authMiddleware = require("../middleware/auth.js")

const userRouter = express.Router();

userRouter.post('/register',registerUser)

userRouter.post("/login", loginUser)

userRouter.get("/current",authMiddleware,currentUser)

module.exports = userRouter;