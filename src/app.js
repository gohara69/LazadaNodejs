require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')

app.use(cors())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
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
app.use('', require('./routes'))

//check not found error
app.use((req, res, next) => {
    const error = new Error()
    error.status = 404
    error.message = 'Not found'
    next(error)
})

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || 'Internal Server Error'
    return res.status(status).json({
        status: 'error',
        code: status,
        message: message
    })
})

module.exports =  app 