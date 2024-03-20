'use strict'

const mongoose = require('mongoose')

const countConnections = () => {
    const numberConnections = mongoose.connections.length
    console.log(`Number of connections: ${numberConnections}`)
}

module.exports = {
    countConnections
}