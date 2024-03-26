'use strict'

const { Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'KeyToken'
const COLLECTION_NAME = 'KeyTokens'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    publicKey:{
        type:String,
        required:true
    },
    privateKey: {
        type:String,
        required:true
    },
    refreshToken:{
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);