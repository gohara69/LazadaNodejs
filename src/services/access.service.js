'use strict'

const usersModel = require("../models/users.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const createPairTokens = require("../auths/authUtils")
const { type } = require("os")
const getInfoData = require("../utils/index.utils")
const UserRole = {
    USER: 'USER',
    WRITOR: 'WRITOR',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        try {
            const holderUser = await usersModel.findOne({ email: email }).lean()
            if(holderUser){
                return {
                    code: '402',
                    message: 'Error email registed',
                    status: 'error'
                }
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
                    return {
                        code: '400',
                        message: 'publicKeyString error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)                
                const tokens = await createPairTokens({userId: newUser._id, email: email}, publicKeyObject, privateKey)
                
                return {
                    code: '201',
                    metadata: {
                        user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser}),
                        tokens
                    }
                }
            }

            return {
                code: '200',
                metadata: null
            }
        } catch(error){
            return {
                code: 'E402',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService