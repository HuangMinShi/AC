const db = require('../models')
const { Category } = db

const categoryService = {

  getCategories: (req, res, cb) => {
    const promiseOptions = [Category.findAll(), Category.findByPk(req.params.id)]

    return Promise
      .all(promiseOptions)
      .then(results => {
        const [categories, category] = results
        const options = {
          categories,
          category
        }

        return cb(options)
      })
      .catch(err => {
        console.log(err)
      })
  },

  postCategories: (req, res, cb) => {
    if (!req.body.category) {
      const results = {
        status: 'failure',
        message: '請輸入類別'
      }
      return cb(results)
    }

    return Category
      .create({ name: req.body.category })
      .then(category => {
        const results = {
          status: 'success',
          message: '成功新增類別'
        }

        return cb(results)
      })
      .catch(err => {
        console.log(err)
      })
  },

  putCategory: (req, res, cb) => {
    if (!req.body.category) {
      const results = {
        status: 'failure',
        message: '請填入修改類別'
      }

      return cb(results)
    }

    return Category
      .findByPk(req.params.id)
      .then(category => {
        return category.update({ name: req.body.category })
      })
      .then(() => {
        const results = {
          status: 'success',
          message: '成功更新類別'
        }

        return cb(results)
      })
      .catch(err => {
        console.log(err)
      })
  },

  deleteCategory: (req, res, cb) => {
    return Category
      .findByPk(req.params.id)
      .then(category => {
        return category.destroy()
      })
      .then(() => {
        const results = {
          status: 'success',
          message: '成功刪除類別'
        }

        return cb(results)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = categoryService