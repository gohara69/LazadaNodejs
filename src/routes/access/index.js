'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../handlers/asyncHandler')
const router = express.Router()

router.post('/user/signup', asyncHandler(accessController.signUp))

router.post('/user/login', asyncHandler(accessController.login))


module.exports = router