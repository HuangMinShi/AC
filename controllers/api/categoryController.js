const db = require('../../models')
const { Category } = db

const categoryService = require('../../services/categoryService')

const categoryController = {

  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  postCategories: (req, res) => {
    return categoryService.postCategories(req, res, (data) => {
      return res.json(data)
    })
  },

  putCategory: (req, res) => {
    return categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  }



}

module.exports = categoryController