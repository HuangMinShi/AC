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

  // 取得編輯分類的頁面

  // 更新一筆分類

  // 刪除一筆分類

}