'use strict'

const mongoose = require('mongoose')
const { db: {host, port , name} } = require('../configs/config.mongo')
const connectionString = `mongodb://${host}:${port}/${name}`
const {countConnections} = require('../helpers/check.connection')

class Database {
    constructor(){
        this.connect()
    }

    connect(type = 'mongodb'){
        mongoose.connect(connectionString).then(_ => { console.log('Connect Mongodb Success') })
        .catch(err => { console.log('Error Mongodb') })
        countConnections()
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const mongoInstance = Database.getInstance()

module.exports = mongoInstance