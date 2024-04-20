'use strict'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { ConflictRequestResponse, BadRequestResponse, ForbiddenRequestResponse } = require("../handlers/handlerError")
const statusCodes = require("../handlers/statusCodes")
const { createPairTokens, JWTverify } = require('../auths/authUtils')
const keyTokenModel = require("../models/keyToken.model")
const shopsModel = require("../models/shops.model")
const { getInfoData } = require('../utils/index.utils')
const ShopRole = {
    USER: 'USER',
    WRITOR: 'WRITOR',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        const holderShop = await shopsModel.findOne({ email: email }).lean()
        if(holderShop){
            throw new ConflictRequestResponse('Conflicted Email Error')
        }
            
        const hashPassword = await bcrypt.hash(password, 10);
        const newShop = await shopsModel.create({ name, email, password: hashPassword, roles: [ShopRole.USER] })
        
        if(newShop) {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                }, 
            })

            const { accessToken, refreshToken } = await createPairTokens({shopId: newShop._id, email: email}, publicKey, privateKey)

            await KeyTokenService.generateToken({
                shopId: newShop._id,
                publicKey,
                privateKey,
                refreshToken
            })
            
            return {
                code: statusCodes.CREATED,
                metadata: {
                    shop: getInfoData(['_id', 'name', 'email'], newShop),
                    tokens: { accessToken, refreshToken }
                }
            }
        }

        return {
            code: statusCodes.CREATED,
            metadata: null
        }
    } 

    static login = async ({email, password}) => {
        const holderShop = await shopsModel.findOne({ email: email }).lean()
        if(!holderShop){
            throw new BadRequestResponse('Email Not Registed')
        }
            
        const passwordCompare = await bcrypt.compare(password, holderShop.password)
        if(!passwordCompare){
            throw new UnauthorizeRequestResponse('Unauthorize Request Error')
        }

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            }, 
        })
        
        const tokens = await createPairTokens({userId: holderShop._id, email: email}, publicKey, privateKey)
        
        if(!tokens){
            throw new BadRequestResponse('Create Token Error')
        }
        
        await KeyTokenService.generateToken({
            userId: holderShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        const filter = ['_id', 'name', 'email']
        const user = getInfoData(filter, holderShop)

        return {
            code: statusCodes.OK,
            metadata: {
                shop: user,
                tokens
            }
        }
    }

    static logout = async (keyToken) => {
        const delToken = await KeyTokenService.removeById(keyToken._id)
        return delToken
    }

    static checkRefreshToken = async ({refreshToken}) => {
        //Check refreshToken đã tồn tại trong array refreshToken đã sử dụng
        const usedToken = await KeyTokenService.findKeyContainsX(refreshToken)
        if(usedToken){
            KeyTokenService.removeById(usedToken._id)
            throw new ForbiddenRequestResponse('Something Went Wrong! Please relogin')
        }

        //Lấy token ra kiểm tra tính đúng đắn của token
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        //Decode refreshToken để so sánh với userId của token có trùng nhau không
        const decode = await JWTverify(refreshToken, holderToken.publicKey)
        if(decode.userId != holderToken.user){
            await KeyTokenService.removeById(holderToken._id)
            throw new ForbiddenRequestResponse('Something Went Wrong! Please relogin')
        }

        //Kiểm tra user có tồn tại không
        const foundShop = await KeyTokenService.findByUserId(decode.userId)
        if(!foundShop){
            await KeyTokenService.removeById(holderToken._id)
            throw new ForbiddenRequestResponse('Something Went Wrong! Please relogin')
        }

        //RefreshToken bth thì cập nhật lại token
        const tokens = await createPairTokens({ userId: foundShop._id, email: foundShop.email }, holderToken.publicKey, holderToken.privateKey)
        
        await KeyTokenService.updateToken({_id: holderToken._id, newRefreshToken: tokens.refreshToken, refreshToken: refreshToken})
        return {
            shop: { userId: foundShop._id, email: foundShop.email },
            tokens
        }
    }
} 


module.exports = AccessService