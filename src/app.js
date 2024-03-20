const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

//init db
require('./dbs/init.mongodb')

app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Chào mừng đến trang Instagram'
    })
})

module.exports =  app 