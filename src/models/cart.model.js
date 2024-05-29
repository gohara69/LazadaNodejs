'use strict'

const {Schema, model, Types} = require('mongoose'); 

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

var cartSchema = new Schema({
    cart_state: {
        type:String, 
        required:true,
        enum: ['active', 'completed', 'pending', 'failed'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: []
    },
    cart_product_count: {
        type: Number,
        required: true,
        default: 0
    },
    cart_user_id: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, cartSchema);