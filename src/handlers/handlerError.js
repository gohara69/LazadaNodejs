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
    constructor(message) {
        super(statusCodes.BAD_REQUEST, message)
    }
}

class ConflictRequestResponse extends ErrorResponse {
    constructor(message) {
        super(statusCodes.CONFLICT, message)
    }
}

class ForbiddenRequestResponse extends ErrorResponse {
    constructor(message) {
        super(statusCodes.FORBIDDEN, message)
    }
}

module.exports = {
    BadRequestResponse,
    ConflictRequestResponse,
    ForbiddenRequestResponse
}