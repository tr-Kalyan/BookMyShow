const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../.env'});
const privateKey = process.env.JWT_KEY;;

const authMiddleware = async(req,res,next) => {
    try{
        const {authorization} = req.headers;

        const token = authorization.split(" ")[1];

        const verifiedToken = jwt.verify(token,privateKey);

        req.body.id = verifiedToken.userId;

        next();
    }

    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

module.exports = authMiddleware;