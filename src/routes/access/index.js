'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auths/authUtils')
const router = express.Router()

//Authentication trước khi logout
router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/checkrefreshtoken', asyncHandler(accessController.checkRefreshToken))
module.exports = router