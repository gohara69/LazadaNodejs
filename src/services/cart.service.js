'use strict'

const cartModel = require('../models/cart.model')
const { getProductById } = require('../repositories/product.repo')
const { BadRequestResponse, NotFoundRequestResponse } = require("../handlers/handlerError")

class CartService {
    static async getAnotherProperties(product){
        const {productId} = product
        const foundProduct = await getProductById(productId)
        product.name = foundProduct.product_name
        product.thumbnail= foundProduct.product_thumbnail
        return product
    }

    static async createUserCart({userId, product = {}}){
        const {quantity} = product
        product = await CartService.getAnotherProperties(product)
        const query = { cart_user_id: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet:{
                cart_products: product
            },
            cart_product_count: quantity
        },
        options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartItemNotExist({userId, product = {}}){
        const {quantity} = product
        product = await CartService.getAnotherProperties(product)
        const query = { cart_user_id: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet:{
                cart_products: product
            },
            $inc:{
                cart_product_count: quantity
            }
        },
        options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCart({userId, product = {}}){
        const {productId, quantity} = product
        const query = 
        { 
            cart_user_id: userId, 
            'cart_products.productId': productId, 
            cart_state: 'active' 
        },
        updateSet = {
            $inc:{
                'cart_products.$.quantity': quantity,
                cart_product_count: quantity
            },
        },
        options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}){
        const {productId} = product
        const cartUser = await cartModel.findOne({cart_user_id: userId}).lean()
        if(!cartUser){
            return await CartService.createUserCart({userId, product})
        }

        //Có giỏ hàng nhưng không có sản phẩm
        if(cartUser.cart_products.length == 0){
            product = await CartService.getAnotherProperties(product)
            const query = {cart_user_id: userId},
            update = {
                $addToSet: {
                    cart_products: product
                },
                cart_product_count: product.quantity
            },
            options = { upsert: true, new: true }
            return await cartModel.findOneAndUpdate(query, update, options)
        }

        //Thêm sản phẩm chưa có trong giỏ hàng
        let existedProduct = []
        existedProduct = cartUser.cart_products.filter(x => 
            x.productId === productId.toString()
        )

        if(existedProduct.length == 0){
            return await CartService.updateUserCartItemNotExist({userId, product})
        }

        //Thêm sản phẩm đang có trong giỏ hàng
        return await CartService.updateUserCart({userId, product})
    }

    /*
       shop_order_ids = [
         shopId,
         items_products = [
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            ]
        ]
    */
    static async addToCartV2({userId, shop_order_ids}){
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.items_products[0]
        const foundProduct = await getProductById(productId)
        if(!foundProduct){
            throw new NotFoundRequestResponse('Product not found')
        }

        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundRequestResponse('Shop not found')
        }

        if(quantity === 0){
            return await CartService.deleteUserCart({userId, productId})
        }

        return await CartService.updateUserCart({
            userId, 
            product: { 
                productId, 
                quantity: quantity - old_quantity 
            }
        })
    }

    static async deleteUserCart({userId, productId}){
        const cartUser = await cartModel.findOne({cart_user_id: userId}).lean()
        if(!cartUser){
            throw new NotFoundRequestResponse(`Not found cart`)
        }

        let existedProduct = []
        existedProduct = cartUser.cart_products.filter(x => 
            x.productId === productId
        )
        console.log(existedProduct)
        const {quantity} = existedProduct[0]
        const query = { cart_user_id: userId, cart_state: 'active' },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            },
            $inc:{
                cart_product_count: -quantity
            }
        }

        return await cartModel.updateOne(query, updateSet)
    }

    static async getListUserCart({userId}){
        return await cartModel.findOne({
            cart_user_id: userId
        }).lean()
    }
}

module.exports = CartService