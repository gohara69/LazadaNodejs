'use strict'

const { OK, Created } = require("../handlers/successHandler")
const ProductService = require("../services/product.service")

class ProductController {
    static createProduct = async (req, res, next) => {
        new Created({
            message: 'Create Product Success',
            metadata: await ProductService.createProduct(req.body.product_type, 
                {
                    ...req.body,
                    product_shop: req.userId
                }
            )
        }).send(res)
    }

    static getDraftProduct = async (req, res, next) => {
        new OK({
            message: 'Query draft product success',
            metadata: await ProductService.getDraftProduct(req.userId)
        }).send(res)
    }

    static getPublishedProduct = async (req, res, next) => {
        new OK({
            message: 'Query published product success',
            metadata: await ProductService.getPublishedProduct(req.userId)
        }).send(res)
    }

    static changeToPublished = async (req, res, next) => {
        new OK({
            message: 'Update product status success',
            metadata: await ProductService.changeToPublished(req.userId, req.params.id)
        }).send(res)
    }

    static changeToDraft = async (req, res, next) => {
        new OK({
            message: 'Update product status success',
            metadata: await ProductService.changeToDraft(req.userId, req.params.id)
        }).send(res)
    }

    static getSearchProduct = async (req, res, next) => {
        new OK({
            message: 'Search products success',
            metadata: await ProductService.getSearchProduct(req.params)
        }).send(res)
    }

    static getAllSellerProduct = async (req, res, next) => {
        new OK({
            message: 'Get all products success',
            metadata: await ProductService.getAllSellerProduct(req.userId)
        }).send(res)
    }

    static getAllProduct = async (req, res, next) => {
        new OK({
            message: 'Get all products success',
            metadata: await ProductService.getAllProduct(req.query)
        }).send(res)
    }

    static getProductDetail = async (req, res, next) => {
        new OK({
            message: 'Get product detail success',
            metadata: await ProductService.getProductDetail(req.params.product_id)
        }).send(res)
    }

    static updateProduct = async (req, res, next) => {
        new OK({
            message: 'Update product success',
            metadata: await ProductService.updateProduct(req.body.product_type, 
                                                        req.params.product_id,
                                                        { 
                                                            ...req.body,
                                                            product_shop: req.userId
                                                        }
                                                        )
        }).send(res)
    }
}

module.exports = ProductController