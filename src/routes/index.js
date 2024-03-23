'use strict'

const express = require('express')
const { checkApiKey, checkPermission } = require('../auths/apiKey.auth')
const router = express.Router()

//check API key
router.use(checkApiKey)
//check Permission
router.use(checkPermission('full'))

router.use('/v1/api', require('./access'))

module.exports = router