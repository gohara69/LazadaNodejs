require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const { checkApiKey } = require('./auths/apiKey.auth')

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//init db
require('./dbs/init.mongodb')

//init route
app.use('', require('../src/routes'))

module.exports =  app 