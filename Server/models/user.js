const {Schema,model} = require('mongoose')

const userSchema = new Schema({

        fullName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        dob:{
            type:Date,
            required:true,
        },
        gender:{
            type:String,
            enum:["MALE","FEMALE"],
        },
        phone:{
            type:String,
        },
    },
    {timestamps:true}
)

const User = model('user',userSchema)

module.exports = User;