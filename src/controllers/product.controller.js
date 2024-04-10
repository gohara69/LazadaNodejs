'use strict'

const statusCodes = require("../handlers/statusCodes")
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
}

module.exports = ProductController