const mongoose=require('mongoose');
const colSchema=new mongoose.Schema({
    colorName:{
        type:String,
        required:true,
        unique:true
    },
    colorCode:{
      type:String,
      required:true
    },
})
module.exports=mongoose.model('Color',colSchema);