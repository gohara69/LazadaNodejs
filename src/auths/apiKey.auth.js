'use strict'

const { ForbiddenRequestResponse } = require("../handlers/handlerError")
const apiKeyModel = require("../models/apiKey.model")

const HEADER = {
    API_KEY: 'x-api-key'
}

const checkApiKey = async ( req, res, next ) => {
    const apiKey = req.headers[HEADER.API_KEY]?.toString()
    if(!apiKey){
        throw new ForbiddenRequestResponse(403, 'Forbidden Request Error')
    }

    const objKey = await apiKeyModel.findOne({key: apiKey, status: true}).lean()
    if(!objKey){
        throw new ForbiddenRequestResponse(403, 'Forbidden Request Error')
    }
    req.objKey = objKey
    return next()
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            throw new ForbiddenRequestResponse(403, 'Forbidden Request Error')
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            throw new ForbiddenRequestResponse(403, 'Forbidden Request Error')
        }
        return next()
    }
}

module.exports = {
    checkApiKey,
    checkPermission
}