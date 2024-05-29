'use strict'

const { getSelectData, getUnSelectData } = require("../utils/index.utils")

const getAllModelWithSelect = async (limit, page, sort, filter, select, model) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await model.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(getSelectData(select))
    .lean()
}

const getAllModelWithUnSelect = async (limit, page, sort, filter, unselect, model) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    return await model.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(getUnSelectData(unselect))
    .lean()
}

module.exports = {
    getAllModelWithUnSelect,
    getAllModelWithSelect
}