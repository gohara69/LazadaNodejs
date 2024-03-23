'use strict'

const apiKeyModel = require("../models/apiKey.model")

const HEADER = {
    API_KEY: 'x-api-key'
}

const checkApiKey = async ( req, res, next ) => {
    const apiKey = req.headers[HEADER.API_KEY]?.toString()
    if(!apiKey){
        return res.status(403).json({
            message: 'Forbidden Error'
        })
    }

    const objKey = await apiKeyModel.findOne({key: apiKey, status: true}).lean()
    if(!objKey){
        return res.status(403).json({
            message: 'Forbidden Error'
        })
    }
    req.objKey = objKey
    return next()
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }
        return next()
    }
}

module.exports = {
    checkApiKey,
    checkPermission
}