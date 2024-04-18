'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getSearchProduct))
router.get('', asyncHandler(productController.getAllProduct))
router.get('/:product_id', asyncHandler(productController.getProductDetail))

module.exports = router