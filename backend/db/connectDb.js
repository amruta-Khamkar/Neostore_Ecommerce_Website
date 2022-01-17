const mongoose=require('mongoose')

const db = "mongodb://localhost:27017/Ecommerce";

 const connectDb = async () => {
    try {
        await mongoose.connect(db);
        console.log("mongodb connected");
    }
    catch (err) {
        console.log(err.message)
    }
}
module.exports=connectDb