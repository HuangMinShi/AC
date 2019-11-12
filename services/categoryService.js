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


}

module.exports = categoryService