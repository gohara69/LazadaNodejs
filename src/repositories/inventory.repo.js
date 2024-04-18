'use strict'

const inventoryModel = require("../models/inventory.model")

const createInventory = async (productId, location, stock, shop) => {
    return await inventoryModel.create({
                                        "inventory_product": productId,
                                        "inventory_location": location,
                                        "inventory_shop": shop,
                                        "inventory_stock": stock
                                        })
}

module.exports = {
    createInventory
}