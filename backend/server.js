const express = require("express")
const dotenv = require("dotenv").config()
const {errorHandler} = require("./middleware/errorMiddleware")

const goalsRoutes = require("./routes/goalRoutes");
const usersRoutes = require("./routes/usersRoutes");


const { urlencoded } = require("express");

const connectDB = require("./config/config")
port =  process.env.PORT || 5050;

connectDB()
const app = express()
app.use(express.json());
app.use(urlencoded({extended: false}))

// Routes 
app.use(`/api/goals`, goalsRoutes)
app.use(`/api/users`, usersRoutes)


app.use(errorHandler)




app.listen(port, () => {
    console.log("server is up and runing")
}) 