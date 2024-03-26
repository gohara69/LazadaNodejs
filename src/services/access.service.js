'use strict'

const usersModel = require("../models/users.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const createPairTokens = require("../auths/authUtils")
const getInfoData = require("../utils/index.utils")
const { ConflictRequestResponse } = require("../handlers/handlerError")
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
            
            const publicKeyString = await KeyTokenService.generateToken({
                userId: newUser._id,
                publicKey,
            })

            if(!publicKeyString){
                throw new BadRequestResponse('publicKeyString error')
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString)                
            const tokens = await createPairTokens({userId: newUser._id, email: email}, publicKeyObject, privateKey)
            
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
}

module.exports = AccessService