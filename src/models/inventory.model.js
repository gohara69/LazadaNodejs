'use strict'

const {Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inventory_product:{ type: Schema.Types.ObjectId, required:true, ref:'Product'},
    inventory_location:{ type:String, default: 'unknown' },
    inventory_stock:{ type: Number, require: true },
    inventory_shop: { type: Schema.Types.ObjectId, required:true, ref:'Shop'}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);