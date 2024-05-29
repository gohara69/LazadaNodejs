'use strict'

const { mongoose, model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

var userSchema = new Schema({
    name:{ type:String, trim: true, maxLength: 150 },
    email:{ type:String, required:true, unique:true },
    password:{ type:String, required:true, },
    status:{ type:String, enum: ['active', 'inactive'], default: 'inactive' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);