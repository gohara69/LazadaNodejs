'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Clothing'
const COLLECTION_NAME = 'Clothings'

// Declare the Schema of the Mongo model
var clothingSchema = new Schema({
    brand:{ type:String, required:true },
    type: { type:String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, required:true, ref:'Shop'}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, clothingSchema);