const db = require('../models')
const { Restaurant, Category, User, Comment } = db

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }

    return Restaurant
      .findAndCountAll({
        include: Category, where: whereQuery, offset, limit: pageLimit, raw: false
      })
      .then(results => {
        // pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(results.count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = results.rows.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))

        Category
          .findAll()
          .then(categories => {
            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
              page,
              pages,
              totalPage,
              prev,
              next
            })
          })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] }
        ]
      })
      .then(restaurant => {
        return res.render('restaurant', { restaurant })
      })
  },

  getFeeds: (req, res) => {
    return Restaurant
      .findAll({
        limit: 10,
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        include: [Category]
      })
      .then(restaurants => {
        return Comment
          .findAll({
            limit: 10,
            order: [['createdAt', 'DESC'], ['id', 'ASC']],
            include: [User, Restaurant]
          })
          .then(comments => {
            return res.render('feeds', { restaurants, comments })
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

module.exports = restController