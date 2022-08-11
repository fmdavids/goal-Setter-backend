const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")
const asyncHandler = require("express-async-handler") 


const protect = asyncHandler( async (req, res, next) => {

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
        try {
            // get token from bearer 
            token = req.headers.authorization.split(" ")[1]

            // verify the token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get token from user 
            req.user = await User.findById(decoded.id).select("-password")

            next();
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error("Not Authourized")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("Not Authourized, No Token")
    }

})


module.exports = {protect}