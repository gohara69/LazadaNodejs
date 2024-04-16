'use strict'
const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [ el, 1 ]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [ el, 0 ]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if(obj[k] === null || obj[k] === undefined){
            delete obj[k]
        }
    })

    return obj
}

const updateNestedObject = (object) => {
    let obj = removeUndefinedObject(object)
    const result = {}

    Object.keys(obj).forEach( k => {
        if(typeof obj[k] == 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObject(obj[k])
            Object.keys(response).forEach( a => {
                result[`${k}.${a}`] = response[a]
            })
        } else {
            result[k] = obj[k]
        }
    })

    return result
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObject
}