const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
    productName: { type: String, required: true },
    productImage: { type: String , required: true },
    productDescrip: { type: String, required: true},
    productRating: { type: Number, },
    productProducer: { type: String, required: true },
    productCost: { type: Number, required: true },
    productStock: { type: Number, required: true },
    productDimension: { type: String, required: true },
    productMaterial: { type: String, required: true },
    colorId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Color',
        default:null
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        default:null
    },
    created_at:{
        type:Date,
        default:Date.now
      },
      RatingArray:{
        type:Array
      },
    subImages:[

    ]
});

module.exports = mongoose.model("product", productModel);