'use strict'

const reasonPhrase = require("./reasonPhrase")
const statusCodes = require("./statusCodes")

class ErrorResponse extends Error {
    constructor(status, message){
        super(message)
        this.status = status
    }
}

class BadRequestResponse extends ErrorResponse {
    constructor(status, message) {
        const statusResponse = status || statusCodes.BAD_REQUEST
        const messageResponse = message || reasonPhrase.BAD_REQUEST
        super(statusResponse, messageResponse)
    }
}

class ConflictRequestResponse extends ErrorResponse {
    constructor(status, message) {
        const statusResponse = status || statusCodes.CONFLICT
        const messageResponse = message || reasonPhrase.CONFLICT
        super(statusResponse, messageResponse)
    }
}

class ForbiddenRequestResponse extends ErrorResponse {
    constructor(status = statusCodes.FORBIDDEN, message) {
        super(status, message)
    }
}

module.exports = {
    BadRequestResponse,
    ConflictRequestResponse,
    ForbiddenRequestResponse
}