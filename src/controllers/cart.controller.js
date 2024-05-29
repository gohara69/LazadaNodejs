'use strict'

const { Created, OK } = require("../handlers/successHandler")
const CartSerivce = require("../services/cart.service")

class CartController {
    static getCartList = async (req, res, next) => {
        new OK({
            message: 'Get cart list success',
            metadata: await CartSerivce.getListUserCart(req.body)
        }).send(res)
    }

    //when click add to cart
    static addToCart = async (req, res, next) => {
        new Created({
            message: 'Add to cart success',
            metadata: await CartSerivce.addToCart(req.body)
        }).send(res)
    }

    //+ -
    static update = async (req, res, next) => {
        new OK({
            message: 'Update cart success',
            metadata: await CartSerivce.addToCartV2(req.body)
        }).send(res)
    }

    //+ -
    static deleteCart = async (req, res, next) => {
        new OK({
            message: 'Delete cart success',
            metadata: await CartSerivce.deleteUserCart(req.body)
        }).send(res)
    }
}

module.exports = CartController