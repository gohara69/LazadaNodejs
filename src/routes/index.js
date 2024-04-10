'use strict'

const express = require('express')
const { checkApiKey, checkPermission } = require('../auths/apiKey.auth')
const router = express.Router()
const asyncHandler = require('./../helpers/asyncHandler')

//check API key
//router.use(asyncHandler(checkApiKey))
//check Permission
//router.use(asyncHandler(checkPermission('full')))

router.use('/v1/api', require('./access'))
router.use('/v1/api', require('./apiKey'))
router.use('/v1/api/product', require('./product'))

module.exports = router