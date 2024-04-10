'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auths/authUtils')
const router = express.Router()

//Authentication trước khi logout
router.use(authentication)
router.post('', asyncHandler(productController.createProduct))

module.exports = router