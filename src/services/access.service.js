'use strict'

const usersModel = require("../models/users.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const getInfoData = require("../utils/index.utils")
const { ConflictRequestResponse, BadRequestResponse, ForbiddenRequestResponse } = require("../handlers/handlerError")
const statusCodes = require("../handlers/statusCodes")
const { createPairTokens, JWTverify } = require('../auths/authUtils')
const keyTokenModel = require("../models/keyToken.model")
const UserRole = {
    USER: 'USER',
    WRITOR: 'WRITOR',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        const holderUser = await usersModel.findOne({ email: email }).lean()
        if(holderUser){
            throw new ConflictRequestResponse('Conflicted Email Error')
        }
            
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await usersModel.create({ name, email, password: hashPassword, roles: [UserRole.USER] })
        
        if(newUser) {
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

            const { accessToken, refreshToken } = await createPairTokens({userId: newUser._id, email: email}, publicKey, privateKey)

            await KeyTokenService.generateToken({
                userId: newUser._id,
                publicKey,
                privateKey,
                refreshToken
            })
            
            return {
                code: statusCodes.CREATED,
                metadata: {
                    user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser}),
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
        const holderUser = await usersModel.findOne({ email: email }).lean()
        if(!holderUser){
            throw new BadRequestResponse('Email Not Registed')
        }
            
        const passwordCompare = await bcrypt.compare(password, holderUser.password)
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
        
        const tokens = await createPairTokens({userId: holderUser._id, email: email}, publicKey, privateKey)
        
        if(!tokens){
            throw new BadRequestResponse('Create Token Error')
        }
        
        await KeyTokenService.generateToken({
            userId: holderUser._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        return {
            code: statusCodes.OK,
            metadata: {
                user: getInfoData({ fields: ['_id', 'name', 'email'], object: holderUser}),
                tokens
            }
        }
    }

    static logout = async ( keyToken ) => {
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
        const foundUser = await KeyTokenService.findByUserId(decode.userId)
        if(!foundUser){
            await KeyTokenService.removeById(holderToken._id)
            throw new ForbiddenRequestResponse('Something Went Wrong! Please relogin')
        }

        //RefreshToken bth thì cập nhật lại token
        const tokens = await createPairTokens({ userId: foundUser._id, email: foundUser.email }, holderToken.publicKey, holderToken.privateKey)
        
        await KeyTokenService.updateToken({_id: holderToken._id, newRefreshToken: tokens.refreshToken, refreshToken: refreshToken})
        return {
            shop: { userId: foundUser._id, email: foundUser.email },
            tokens
        }
    }
} 


module.exports = AccessService