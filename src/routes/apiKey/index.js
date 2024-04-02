'use strict'

const express = require('express')
const ApiController = require('../../controllers/api.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.get('/api', asyncHandler(ApiController.test))

module.exports = router