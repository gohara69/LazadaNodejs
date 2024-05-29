'use strict'
const productModel = require('../models/product.model')
const { BadRequestResponse } = require("../handlers/handlerError")
const { Document } = require('../constants/index.constant')
const { getSelectData, getUnSelectData, getObjectId } = require('../utils/index.utils')

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

const getSellerProduct = async (query, limit, skip) => {
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

const getSearchProduct = async (textSearch) => {
    const searchRex = new RegExp(textSearch)
    return await productModel.find({
        "isPublished": true,
        $text: { $search: searchRex }}, 
        { score: { $meta: 'textScore' }})
    .sort({ score: { $meta: 'textScore' } })
    .lean()            
}

const getAllProduct = async (limit, page, sort, filter, select) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await productModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(getSelectData(select))
    .lean()
}

const getProductDetail = async (product_id, unselect) => {
    const query = { "_id": product_id, "isPublished": true }

    return await productModel.find(query)
    .select(getUnSelectData(unselect))
    .lean()
}

const updateProductById = async (_id, model, payload, isNew = true) => {
    return await model.findByIdAndUpdate(_id, payload, { new: isNew })
}

const getProductById = async (productId) => {
    return await productModel.findOne({_id: productId}).lean()
}

module.exports = {
    getDraftProduct,
    getPublishedProduct,
    changeToPublished,
    changeToDraft,
    getSearchProduct,
    getAllProduct,
    getProductDetail,
    updateProductById,
    getSellerProduct,
    getProductById
}