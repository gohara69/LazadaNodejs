'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access/publicIndex'))
router.use('/v1/api/product', require('./product/publicIndex'))
router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./apiKey'))

module.exports = router