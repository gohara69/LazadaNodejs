'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auths/authUtils')
const router = express.Router()

//Authentication trước khi logout
router.use(authentication)
router.get('/', asyncHandler(cartController.getCartList))
router.post('/', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.update))
router.delete('/', asyncHandler(cartController.deleteCart))

module.exports = router