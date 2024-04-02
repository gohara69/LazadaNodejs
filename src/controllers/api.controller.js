'use strict'

const { Created } = require("../handlers/successHandler")

class ApiController {
    static test = async (req, res, next) => {
        new Created({
            message: 'Lấy thông tin api thành công',
            metadata: null
        }).send(res)
    }
}

module.exports = ApiController