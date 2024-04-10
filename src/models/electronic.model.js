'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Electronic'
const COLLECTION_NAME = 'Electronics'

// Declare the Schema of the Mongo model
var electronicSchema = new Schema({
    manufactory:{ type:String, required:true },
    size:{ type:String },
    color:{ type: String },
    product_shop: { type: Schema.Types.ObjectId, required:true, ref:'Shop'}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, electronicSchema);