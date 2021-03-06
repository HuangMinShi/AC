const db = require('../models')
const { Category } = db

const categoryService = require('../services/categoryService')

const categoryController = {
  // 瀏覽所有分類 & 取得編輯分類的頁面
  getCategories: (req, res) => {
    return categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategories: (req, res) => {
    return categoryService.postCategories(req, res, (data) => {
      if (data.status === 'failure') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }

      req.flash('success_msg', data.message)
      return res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    return categoryService.putCategory(req, res, (data) => {
      if (data.status === 'failure') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }

      req.flash('success_msg', data.message)
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    return categoryService.deleteCategory(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success_msg', data.message)
        return res.redirect('/admin/categories')
      }
    })
  }
}

module.exports = categoryController