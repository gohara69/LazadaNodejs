'use strict'

const productModel = require('../models/product.model')
const electronicModel = require('../models/electronic.model')
const clothingModel = require('../models/clothing.model')
const { 
        getDraftProduct, 
        getPublishedProduct, 
        changeToPublished,
        changeToDraft,
        getSearchProduct,
        getAllProduct,
        getProductDetail,
        updateProductById,
        getSellerProduct
} = require('../repositories/product.repo')

const { BadRequestResponse } = require("../handlers/handlerError")
const { updateNestedObject } = require('../utils/index.utils')
const { createInventory } = require('../repositories/inventory.repo')

//Product factory
class ProductService {
    static productClassType = {}

    static addProductClassType ( type, classType ) {
        ProductService.productClassType[type] = classType
    }

    // // // // //
    // POST REQUEST
    static async createProduct(type, payload){
        const productClassType = ProductService.productClassType[type]
        if(!productClassType)
            throw new BadRequestResponse(`Invalid type: ${type}`)
        return new productClassType(payload).create()
    }
    // // // // //

    // // // // //
    // PATCH REQUEST
    static async updateProduct(type, _id, payload){
        const productClassType = ProductService.productClassType[type]
        if(!productClassType)
            throw new BadRequestResponse(`Invalid type: ${type}`)
        return new productClassType(payload).updateProduct(_id)
    }
    // // // // //

    // // // // //
    // PUT REQUEST
    static async changeToPublished(product_shop, _id){
        return await changeToPublished(product_shop, _id)
    }

    static async changeToDraft(product_shop, _id){
        return await changeToDraft(product_shop, _id)
    }
    // // // // //

    // // // // //
    // GET REQUEST
    static async getDraftProduct(product_shop, limit = 50, skip = 0){
        const query = { "product_shop": product_shop, "isDraft": true }
        return await getDraftProduct(query, limit, skip)
    }

    static async getPublishedProduct(product_shop, limit = 50, skip = 0){
        const query = { "product_shop": product_shop, "isPublished": true }
        return await getPublishedProduct(query, limit, skip)
    }

    static async getAllSellerProduct(product_shop, limit = 50, skip = 0){
        const query = { "product_shop": product_shop }
        return await getSellerProduct(query, limit, skip)
    }

    static async getSearchProduct(keySearch){
        return await getSearchProduct(keySearch)
    }

    static async getAllProduct(limit = 50, page = 1, sort = 'ctime', filter = { isPublished: true }, select = []){
        return await getAllProduct(limit, page, sort, filter, select)
    }

    static async getProductDetail(product_id, unselect = []){
        return await getProductDetail(product_id, unselect)
    }
    // // // // //
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
        const newProduct = await productModel.create({
                                                        ...this,
                                                        _id: _id
                                                    })
        if(newProduct){
            await createInventory(newProduct._id, 'unknown', this.product_quantity, this.product_shop)
        }
        return newProduct
    }

    async updateProduct(_id, payload){
        return await updateProductById(_id, productModel, payload)
    }
}

class Electronics extends Product {
    constructor(payload){
        super(payload)
    }

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

    async updateProduct(_id){
        let objectParam = this

        if(objectParam.product_attribute){
            console.log(`attribute trước khi remove:`, objectParam.product_attribute)
            const productAttribute = updateNestedObject(objectParam.product_attribute)
            console.log(`attribute sau khi remove:`, productAttribute)

            await updateProductById(_id, clothingModel, productAttribute)
        }

        console.log(`product trước khi remove:`, objectParam)
        const product = updateNestedObject(objectParam)
        console.log(`product sau khi remove:`, product)
        const updateProduct = await super.updateProduct(_id, product)
        return updateProduct
    }
}

ProductService.addProductClassType('Clothing', Clothing)
ProductService.addProductClassType('Electronics', Electronics)

module.exports = ProductService