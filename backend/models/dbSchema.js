const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    emailAddress:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    phoneNumber:{
        type:Number,
    },
    gender:{
        type:String
    },
    otp:{
        type:Number
    },
    photo:{
        type:String
    },
    cartData:{
        type:Array
    },
    address:{
        type:Array
    },
    provider:{
        type:String
    },
    isVerified:{
        type:Boolean
    }
})

const userModel=mongoose.model('user',userSchema)

module.exports={
    userModel:userModel,
}