'use strict'

const { mongoose, model, Schema } = require('mongoose'); 

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{
        type:String,
        require: true,
    },
    product_thumbnail:{
        type:String,
        required:true,
    },
    product_description:{
        type:String,
    },
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity: {
        type: Number,
        required:true
    },
    product_type: {
        type: String,
        require: true,
        enum: ['Electronics', 'Clothing', 'Furniture', 'Drinks & Alcohol']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    product_attribute: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, productSchema);