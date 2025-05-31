const express = require("express")
const mongoose  = require("mongoose")
const cookieParser = require('cookie-parser')


const patientRoutes = require('./routes/patient')

const app = express()
const PORT = 8000

mongoose.connect('mongodb://127.0.0.1:27017/med-tracker').then(()=>console.log('mongoDB connected'))

app.use(cookieParser())
//app.use(checkForAuthentication)

app.listen(PORT,()=>console.log(`server started at PORT : localhost:${PORT}`))











