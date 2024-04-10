'use strict'

const productModel = require('../models/product.model')
const electronicModel = require('../models/electronic.model')
const clothingModel = require('../models/clothing.model')

const { BadRequestResponse } = require("../handlers/handlerError")

//Product factory
class ProductService {
    static productClassType = {}

    static addProductClassType ( type, classType ) {
        ProductService.productClassType[type] = classType
    }

    static async createProduct(type, payload){
        const productClassType = ProductService.productClassType[type]
        if(!productClassType)
            throw new BadRequestResponse(`Invalid type: ${type}`)
        return new productClassType(payload).create()
    }
}

class Product {
    constructor(
        {product_name, product_thumbnail, product_description, product_price,
        product_quantity, product_type, product_shop, product_attribute}
    ){
        this.product_name = product_name
        this.product_thumbnail = product_thumbnail
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attribute = product_attribute
    }

    async create(_id){
        return await productModel.create({
                                            ...this,
                                            _id: _id
                                        })
    }
}

class Electronics extends Product {
    async create(){
        const newElectronics = await electronicModel.create({
                                                                ...this.product_attribute,
                                                                product_shop: this.product_shop
                                                            })
        if(!newElectronics){
            throw new BadRequestResponse('Failed to create new Electronics')
        }
        const newProduct = await super.create(newElectronics._id)
        if(!newProduct){
            throw new BadRequestResponse('Failed to create new Product')
        }
        return newProduct
    }
}

class Clothing extends Product {
    constructor(payload){
        super(payload)
    }

    async create(){
        const newClothing = await clothingModel.create({
                                                        ...this.product_attribute,
                                                        product_shop: this.product_shop
                                                       })
        if(!newClothing){
            throw new BadRequestResponse('Failed to create new Clothing')
        }
        const newProduct = await super.create(newClothing._id)
        if(!newProduct){
            throw new BadRequestResponse('Failed to create new Product')
        }
        return newProduct
    }
}

ProductService.addProductClassType('Clothing', Clothing)
ProductService.addProductClassType('Electronics', Electronics)

module.exports = ProductService