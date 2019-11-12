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
    if (!req.body.category) {
      req.flash('error_msg', '請輸入類別')
      return res.redirect('back')
    }

    return Category
      .create({ name: req.body.category })
      .then(category => {
        req.flash('success_msg', '成功新增類別')
        return res.redirect('/admin/categories')
      })
      .catch(err => {
        console.log(err)
      })
  },

  putCategory: (req, res) => {
    if (!req.body.category) {
      req.flash('error_msg', '欲修改類別不得為空')
      return res.redirect('back')
    }

    return Category
      .findByPk(req.params.id)
      .then(category => {
        category
          .update({
            name: req.body.category
          })
          .then(category => {
            req.flash('success_msg', '成功更新類別')
            res.redirect('/admin/categories')
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  },

  deleteCategory: (req, res) => {
    return Category
      .findByPk(req.params.id)
      .then(category => {
        category
          .destroy()
          .then(category => {
            req.flash('success_msg', '成功刪除類別')
            res.redirect('/admin/categories')
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = categoryController