'use strict'
const { BadRequestResponse, NotFoundRequestResponse } = require("../handlers/handlerError")
const discountModel = require('../models/discount.model')
const { getAllModelWithUnSelect } = require("../repositories/index.repo")
const { getAllProduct } = require("../repositories/product.repo")
const { getObjectId } = require("../utils/index.utils")

class DiscountService {
    
    static async createDiscountCode (payload) {
        const {
            discount_name, discount_description, discount_type, discount_value,
            discount_code, discount_start_date, discount_end_date, discount_max_uses,
            discount_uses_count, discount_users_used, discount_max_uses_per_user, discount_min_order_value,
            discount_shopId, discount_is_active, discount_applies_to, discount_product_ids,
        } = payload

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new BadRequestResponse(`Discount has been expired`)
        }

        if(new Date(discount_start_date) >= new Date(discount_end_date)){
            throw new BadRequestResponse(`Start date must sooner than end date`)
        }

        const foundDiscount = await discountModel.findOne({
            discount_code: discount_code,
            discount_shopId: getObjectId(discount_shopId)
        }).lean()

        if(foundDiscount){
            throw new BadRequestResponse(`Discount existed`)
        }

        const newDiscount = await discountModel.create({
            discount_name: discount_name, discount_description: discount_description,
            discount_type: discount_type, discount_code: discount_code,
            discount_value: discount_value, discount_min_order_value: discount_min_order_value || 0,
            discount_max_value: discount_max_value, discount_start_date: new Date(discount_start_date),
            discount_end_date: new Date(discount_end_date), discount_max_uses: discount_max_uses,
            discount_uses_count: discount_uses_count, discount_users_used: discount_users_used,
            discount_shopId: getObjectId(discount_shopId), discount_max_uses_per_user: discount_max_uses_per_user,
            discount_is_active: discount_is_active, discount_applies_to: discount_applies_to,
            discount_product_ids: discount_applies_to === "all" ? [] : discount_product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode (payload) {
        const {
            discount_name, discount_description, discount_type, discount_value,
            discount_code, discount_start_date, discount_end_date, discount_max_uses,
            discount_uses_count, discount_users_used, discount_max_uses_per_user, discount_min_order_value,
            discount_shopId, discount_is_active, discount_applies_to, discount_product_ids,
        } = payload

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new BadRequestResponse(`Discount has been expired`)
        }

        if(new Date(discount_start_date) >= new Date(discount_end_date)){
            throw new BadRequestResponse(`Start date must sooner than end date`)
        }

        const foundDiscount = await discountModel.findOne({
            discount_code: discount_code,
            discount_shopId: getObjectId(discount_shopId)
        }).lean()

        if(!foundDiscount){
            throw new BadRequestResponse(`Discount not exist`)
        }

        return await discountModel.findOneAndUpdate(discount_code, payload, { new: isNew })
    }

    static async getProductsByDiscountCode (payload) {
        const {
            discount_code, shopId, limit, page
        } = payload

        const foundDiscount = await discountModel.findOne({
            discount_code: discount_code,
            discount_shopId: getObjectId(discount_shopId)
        }).lean()

        if(!foundDiscount){
            throw new NotFoundRequestResponse(`Discount not exist`)
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products = []
        if(discount_applies_to === 'all'){
            products = await getAllProduct(
                                limit, 
                                page, 
                                'ctime', 
                                { product_shop: getObjectId(shopId), isPublished: true }, 
                                ['product_name'])
        }

        if(discount_applies_to === 'specific'){
            products = await getAllProduct(
                                limit, 
                                page, 
                                'ctime', 
                                { _id: {$in: discount_product_ids}, isPublished: true }, 
                                ['product_name'])
        }

        return products
    }

    static async getAllDiscountCodeByShop(limit, page, shopId){
        const discounts = await getAllModelWithUnSelect(
                            limit, 
                            page, 
                            'ctime', 
                            {discount_shopId: getObjectId(shopId), discount_is_active: true},
                            ['__v', 'discount_shopId'],
                            discountModel)
        
        return discounts
    }
}

module.exports = DiscountService