'use strict'

const usersModel = require("../models/users.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const createPairTokens = require("../auths/authUtils")
const getInfoData = require("../utils/index.utils")
const { ConflictRequestResponse, BadRequestResponse } = require("../handlers/handlerError")
const statusCodes = require("../handlers/statusCodes")
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
            
            const { publicKeyString, privateKeyString } = await KeyTokenService.generateToken({
                userId: newUser._id,
                publicKey,
                privateKey
            })

            if(!publicKeyString || !privateKeyString){
                throw new BadRequestResponse('KeyString error')
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString)         
            const privateKeyObject = crypto.createPublicKey(privateKeyString)         

            const tokens = await createPairTokens({userId: newUser._id, email: email}, publicKeyObject, privateKeyObject)
            
            return {
                code: statusCodes.CREATED,
                metadata: {
                    user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser}),
                    tokens
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
        console.log(`Token bị xóa::`, delToken)
        return delToken
    }
} 


module.exports = AccessService