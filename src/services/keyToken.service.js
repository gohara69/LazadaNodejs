'use strict'

const keyTokenModel = require("../models/keyToken.model")
const { mongoose } = require('mongoose')

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

    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: userId }).lean()
    }

    static removeById = async ( _id ) => {
        return await keyTokenModel.deleteOne({ _id: new mongoose.Types.ObjectId(_id)}).lean()
    }

    static findKeyContainsX = async ( x ) => {
        return await keyTokenModel.findOne({refreshTokenUsed: x}).lean()
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken: refreshToken }).lean()
    }

    static updateToken = async ({_id, newRefreshToken, refreshToken}) => {
        try {
            const filter = { _id: _id }, update = {
                refreshToken: newRefreshToken, 
                $addToSet: {
                    refreshTokenUsed: refreshToken
                }
            }, options = {
                upsert: true, //Nếu không kiếm thấy sẽ tạo mới
                new: true // Nếu cập nhật sẽ quăng thằng vừa mới cập nhật
            }
            const token = await keyTokenModel.findOneAndUpdate(filter, update, options)
        } catch(error){
            return error
        }
    }
}

module.exports = KeyTokenService