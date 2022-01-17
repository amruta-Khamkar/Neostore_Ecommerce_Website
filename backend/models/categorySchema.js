const mongoose=require('mongoose');
const catSchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true
    },
    categoryImage:{
      type:String,
      required:true
    },
    createdAt:{
      type:Date,
      default:Date.now
    }
})
module.exports=mongoose.model('Category',catSchema);