'use strict'

const express = require('express')
const userController = require('../../controllers/user.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auths/authUtils')
const router = express.Router()

//Authentication trước khi logout
router.use(authentication)
router.post('/logout', asyncHandler(userController.logout))
//router.post('/checkrefreshtoken', asyncHandler(userController.checkRefreshToken))
module.exports = router