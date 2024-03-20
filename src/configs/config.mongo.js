'use strict'

const config = {
    app: {
        PORT: process.env.APP_PORT || 3055
    }, 
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
        name: process.env.DB_NAME || 'Instagram'
    }
}

module.exports = config