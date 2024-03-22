'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {
    static generateToken = async ({userId, publicKey}) => {
        try {
            const token = await keyTokenModel.create({
                user: userId,
                publicKey: publicKey
            })
            return token ? publicKey : null
        } catch(error){
            return error
        }
    }
}

module.exports = KeyTokenService