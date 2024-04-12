'use strict'

const reasonPhrase = require("./reasonPhrase");
const statusCodes = require("./statusCodes");

class SuccessResponse {
    constructor({ statusCode, statusTeamCode, message, metadata}){
        this.statusCode = statusCode,
        this.statusTeamCode = statusTeamCode,
        this.message = message,
        this.metadata = metadata
    }

    send(res){
        return res.status(this.statusCode).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ statusCode = statusCodes.OK, statusTeamCode = statusCodes.OK, message, metadata}){
        super({statusCode, statusTeamCode, message, metadata})
    }
}

class Created extends SuccessResponse {
    constructor({ statusCode = statusCodes.CREATED, statusTeamCode = statusCodes.CREATED, message, metadata = {} }){
        super({statusCode, statusTeamCode, message, metadata})
    }
}

module.exports = {
    OK, 
    Created
}