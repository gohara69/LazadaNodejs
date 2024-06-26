'use strict'

const { OK, Created } = require("../handlers/successHandler")
const AccessService = require("../services/access.service")

class AccessController {
    static signUp = async (req, res, next) => {
        const metadata = await AccessService.signUp(req.body)
        new Created({
            message: 'Create Shop Account Success',
            metadata: metadata
        }).send(res)
    }

    static login = async (req, res, next) => {
        const metadata = await AccessService.login(req.body)
        new OK({
            message: 'Login Success',
            metadata: metadata
        }).send(res)
    }

    static logout = async (req, res, next) => {
        new OK({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyToken)
        }).send(res)
    }

    static checkRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Update Refresh Token Success',
            metadata: await AccessService.checkRefreshToken(req.body)
        }).send(res)
    }
}

module.exports = AccessController