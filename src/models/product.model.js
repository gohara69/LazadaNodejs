'use strict'

const { mongoose, model, Schema } = require('mongoose'); 
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{ type:String, require: true },
    product_thumbnail:{ type: String, required:true },
    product_description:{ type:String },
    product_price:{ type:Number, required:true },
    product_quantity: { type: Number, required:true },
    product_slug: { type: String },
    product_type: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture', 'Drinks & Alcohol']},
    product_shop: { type: Schema.Types.ObjectId, required:true, ref: 'Shop' },
    product_attribute: { type: Schema.Types.Mixed, required: true },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

productSchema.pre('save', function (next){
    this.product_slug = slugify(this.product_name, {lower: true, trim: true})
    next()
})

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, productSchema);