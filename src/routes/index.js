'use strict'

const express = require('express')
const { checkApiKey, checkPermission } = require('../auths/apiKey.auth')
const router = express.Router()
const asyncHandler = require('../handlers/asyncHandler')

//check API key
router.use(asyncHandler(checkApiKey))
//check Permission
router.use(asyncHandler(checkPermission('full')))

router.use('/v1/api', require('./access'))

module.exports = router