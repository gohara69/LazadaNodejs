const express = require('express')
const userController = require('../../controllers/user.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.post('/signup', asyncHandler(userController.signUp))
router.post('/login', asyncHandler(userController.login))

module.exports = router