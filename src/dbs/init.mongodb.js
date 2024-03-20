'use strict'

const mongoose = require('mongoose')
const connectionString = 'mongodb://localhost:27017/Instagram'
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