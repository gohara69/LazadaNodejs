'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auths/authUtils')
const router = express.Router()

//Authentication trước khi logout
router.use(authentication)

// // // //
// POST
router.post('', asyncHandler(productController.createProduct))
// END POST
// // // //

// // // //
// QUERY
router.get('/draft', asyncHandler(productController.getDraftProduct))
router.get('/published', asyncHandler(productController.getPublishedProduct))
// END QUERY
// // // //

// // // //
// PUT
router.put('/published/:id', asyncHandler(productController.changeToPublished))
router.put('/draft/:id', asyncHandler(productController.changeToDraft))
// END PUT
// // // //

module.exports = router