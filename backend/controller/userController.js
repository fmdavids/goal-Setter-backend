const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/userSchema")
const expressAsyncHandler = require("express-async-handler")

//@desc Register User
//@route POST /api/users
//@access Public
const registerUser = expressAsyncHandler( async (req, res) => {

    const {name, email, password} = req.body

    // check if fields are filled 
    if(!name || !email || !password){
        res.status(400).json({message: "Please fill out All fileds"})
    }

    // check if user email already in database 
    const userExit = await User.findOne({email})
    if(userExit){
        res.status(400)
        throw new Error("email already registered") 
    }

    const hashPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
        name,
        email,
        password: hashPassword
    })
    
    if(user) {res.status(201).json({ 
        _id: user.id,
        name: user.name,
        email: user.email,
        // token: generateToken(user._id)
    })}

    if(!user){
        res.status(400)
        throw new Error("Wrong Input")
    }
})


//@desc Login User
//@route POST /api/users/login
//@access Public
const loginUser = expressAsyncHandler( async (req, res) => {
    const {email, password} = req.body

    // check for email in database 
    const user = await User.findOne({email})
    // console.log(userEmail)
    const validPassword = await bcrypt.compare(password, user.password)

    const accessToken = jwt.sign({id: user._id, name: user.fullName}, process.env.JWT_SECRET, {expiresIn: '40d'})


    await user.save()
    
        // res.status(201).json({
        //     id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     token: user.id

        // })
        res.status(201).json({
            _id: user._id,
            data: user,
            token: accessToken

        })
    // } else{
        res.status(400)
        throw new Error("wrong credentials")
    // }
})

//@desc Get single User me
//@route POST /api/users/me
//@access private
const getMe = expressAsyncHandler( async (req, res) => {
    const {_id, name, email } = await User.findById(req.body.id)
    // res.status(200).json("display private data")
    res.status(200).json({
        id: _id,
        name,
        email 
    })
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

module.exports = {registerUser, loginUser, getMe} 