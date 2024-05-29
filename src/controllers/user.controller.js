'use strict'

const { OK, Created } = require("../handlers/successHandler")
const UserService = require("../services/user.service")

class AccessController {
    static signUp = async (req, res, next) => {
        const metadata = await UserService.signUp(req.body)
        new Created({
            message: 'Create User Account Success',
            metadata: metadata
        }).send(res)
    }

    static login = async (req, res, next) => {
        const metadata = await UserService.login(req.body)
        new OK({
            message: 'Login Success',
            metadata: metadata
        }).send(res)
    }

    static logout = async (req, res, next) => {
        new OK({
            message: 'Logout Success',
            metadata: await UserService.logout(req.keyToken)
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