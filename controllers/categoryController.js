const db = require('../models')
const { Category } = db

module.exports = {
  // 瀏覽所有分類
  getCatrgories: (req, res) => {
    Category
      .findAll()
      .then(categories => {
        return res.render('admin/categories', { categories })
      })
  },
  // 新增一筆分類
  postCatrgories: (req, res) => {

    if (!req.body.category) {
      req.flash('error_msg', '請輸入類別')
      return res.redirect('/admin/categories')
    }

    Category
      .create({ name: req.body.category })
      .then(category => {
        req.flash('success_msg', '成功新增類別')
        return res.redirect('/admin/categories')
      })
  },

  // 取得編輯分類的頁面

  // 更新一筆分類

  // 刪除一筆分類

}