'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auths/authUtils')
const router = express.Router()

router.use(authentication)

// // // //
// POST
router.post('', asyncHandler(productController.createProduct))
// END POST
// // // //

// // // //
// QUERY
router.get('/draft/all', asyncHandler(productController.getDraftProduct))
router.get('/published/all', asyncHandler(productController.getPublishedProduct))
router.get('/seller/all', asyncHandler(productController.getAllSellerProduct))
// END QUERY
// // // //

// // // //
// PUT
router.put('/published/:id', asyncHandler(productController.changeToPublished))
router.put('/draft/:id', asyncHandler(productController.changeToDraft))
// END PUT
// // // //

// // // //
// PATCH
router.patch('/:product_id', asyncHandler(productController.updateProduct))
// END PATCH
// // // //

module.exports = router