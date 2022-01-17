const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    order:{
        type:Array,
    },
    total:{
        type:Number
    },
    gst:{
        type:Number
    },
    mainTotal:{
        type:Number
    },
    userId:{
        type:String
    },
    deliveryAddress:{
        type:Object
    },
    createdAt:{
      type:Date,
      default:Date.now
    }
})
module.exports=mongoose.model('order',orderSchema);