'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {
    static generateToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            //Luôn tạo ra keyToken mới và không kiểm tra đã tồn tại hay chưa
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })
            // return token ?  publicKey : null
            //=> Sử dụng findOneAndUpdate để có thể vừa kiểm tra, vừa tạo, vừa cập nhật

            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = {
                upsert: true, //Nếu không kiếm thấy sẽ tạo mới
                new: true // Nếu cập nhật sẽ quăng thằng vừa mới cập nhật
            }
            const token = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return token ? publicKey : null
        } catch(error){
            return error
        }
    }
}

module.exports = KeyTokenService