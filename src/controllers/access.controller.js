'use strict'

const statusCodes = require("../handlers/statusCodes")
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
        })
    }
}

module.exports = AccessController