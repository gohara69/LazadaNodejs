'use strict'
const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { ForbiddenRequestResponse, UnauthorizeRequestResponse } = require('../handlers/handlerError')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    USER_ID: 'x-user-id',
    AUTHORIZATION: 'authorization'
}

const createPairTokens = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
    
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err){
                console.log(`error verify`, err)
            } else {
                console.log(`decode verify`, decode)
            }
        })

        return {accessToken, refreshToken}
    } catch(error){
        console.log(error)
    }
}

const authentication = asyncHandler (async (req, res, next) => {
    const userId = req.headers[HEADER.USER_ID]?.toString()
    if(!userId){
        throw new ForbiddenRequestResponse('Forbidden Request Error Missing UserId')
    }

    const keyToken = await KeyTokenService.findByUserId(userId)
    if(!keyToken){
        throw new UnauthorizeRequestResponse('Keytoken not Authorized')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
    if(!accessToken){
        throw new ForbiddenRequestResponse('Forbidden Request Error Missing AccessToken')
    }

    try {
        const decode = JWT.verify(accessToken, keyToken.publicKey)
        if(userId !== decode.userId){
            throw new UnauthorizeRequestResponse('Authorization Request Error')
        }
        req.keyToken = keyToken
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createPairTokens,
    authentication
}