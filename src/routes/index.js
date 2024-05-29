'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access/publicIndex'))
router.use('/v1/api/products', require('./product/publicIndex'))
router.use('/v1/api/users', require('./user/publicIndex'))
router.use('/v1/api', require('./access'))
router.use('/v1/api/users', require('./user/index'))
router.use('/v1/api/carts', require('./cart/index'))
router.use('/v1/api/products', require('./product'))

module.exports = router