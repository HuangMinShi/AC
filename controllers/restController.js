const db = require('../models')
const { Restaurant, Category, User, Comment, sequelize } = db

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
          description: restaurant.dataValues.description.substring(0, 50),
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(restaurant.id),
          isLiked: req.user.LikedRestaurants.map(d => d.id).includes(restaurant.id)
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
      .catch(err => {
        console.log(err)
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        const isLiked = restaurant.LikedUsers.map(u => u.id).includes(req.user.id)
        return res.render('restaurant', { restaurant, isFavorited, isLiked })
      })
      .catch(err => {
        console.log(err)
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
  },

  getDashboard: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, {
        include: [Category, Comment]
      })
      .then(restaurant => {
        restaurant.increment('viewCounts', { by: 1 })
        return res.render('dashboard', { restaurant })
      })
      .catch(err => {
        console.log(err)
      })
  },

  getTopRestaurants: (req, res) => {
    return Restaurant
      .findAll({
        include: [
          { model: User, as: 'FavoritedUsers' }
        ]
      })
      .then(restaurants => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.slice(0, 50),
          FavoritedUsersCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user.FavoritedRestaurants.map(r => r.id).includes(restaurant.id)
        }))

        restaurants = restaurants.sort((a, b) => { return b.FavoritedUsersCount - a.FavoritedUsersCount })
        restaurants = restaurants.slice(0, 10)

        return res.render('topRestaurants', { restaurants })
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = restController
