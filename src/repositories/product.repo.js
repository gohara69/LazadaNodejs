'use strict'
const productModel = require('../models/product.model')
const { BadRequestResponse } = require("../handlers/handlerError")
const { Document } = require('../constants/index.constant')

const getProductByState = async (query, limit, skip) => {
    return await productModel.find(query)
                            .sort({updatedAt: -1})
                            .skip(skip)
                            .limit(limit)
                            .lean()
}

const getDraftProduct = async (query, limit, skip) => {
    return await getProductByState(query, limit, skip)
} 

const getPublishedProduct = async (query, limit, skip) => {
    return await getProductByState(query, limit, skip)
}  

const changeToPublished = async (product_shop, _id) => {
    const filter = { "_id": _id, "product_shop": product_shop}
    const update = { isDraft: false, isPublished: true }

    const foundProduct = await productModel.findOneAndUpdate(filter, update)
    if(!foundProduct)
        throw new BadRequestResponse('Cannot find product to change')

    return Document.UPDATED
}

const changeToDraft = async (product_shop, _id) => {
    const filter = { "_id": _id, "product_shop": product_shop}
    const update = { isDraft: true, isPublished: false }

    const foundProduct = await productModel.findOneAndUpdate(filter, update)
    if(!foundProduct)
        throw new BadRequestResponse('Cannot find product to change')

    return Document.UPDATED
}

module.exports = {
    getDraftProduct,
    getPublishedProduct,
    changeToPublished,
    changeToDraft
}