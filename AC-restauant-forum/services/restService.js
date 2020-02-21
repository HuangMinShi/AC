const db = require('../models')
const { Restaurant, Category, Comment, User } = db

const pageLimit = 10

const restService = {
  getRestaurants: (req, res, cb) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    const findQuery = {
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit,
    }
    const promises = [Restaurant.findAndCountAll(findQuery), Category.findAll()]

    return Promise
      .all(promises)
      .then(queryResults => {
        const [{ count, rows: restaurants }, categories] = queryResults

        // pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = restaurants.map(restaurant => {

          if (restaurant.description && restaurant.description.length > 50) {
            restaurant.description = restaurant.description.substring(0, 50)
          }

          return ({
            ...restaurant.dataValues,
            isFavorited: req.user.FavoritedRestaurants.some(favoritedRest => favoritedRest.id === restaurant.id),
            isLiked: req.user.LikedRestaurants.some(likedRest => likedRest.id === restaurant.id)
          })
        })

        const results = {
          restaurants: data,
          categories,
          categoryId,
          page,
          pages,
          totalPage,
          prev,
          next
        }
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  getRestaurant: (req, res, cb) => {
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
        restaurant.increment('viewCounts', { by: 1 })

        const results = {
          restaurant,
          isFavorited: restaurant.FavoritedUsers.some(favoriteduser => favoriteduser.id === req.user.id),
          isLiked: restaurant.LikedUsers.some(likedUser => likedUser.id === req.user.id)
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  getFeeds: (req, res, cb) => {
    const promises = [
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        include: [User, Restaurant]
      })
    ]

    return Promise
      .all(promises)
      .then(queryResults => {
        const [restaurants, comments] = queryResults
        const results = { restaurants, comments }
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  getDashboard: (req, res, cb) => {
    return Restaurant
      .findByPk(req.params.id, {
        include: [Category, Comment]
      })
      .then(restaurant => {
        const results = { restaurant }
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  getTopRestaurants: (req, res, cb) => {
    return Restaurant
      .findAll({
        include: [
          { model: User, as: 'FavoritedUsers' }
        ]
      })
      .then(restaurants => {
        restaurants = restaurants
          .map(restaurant => {

            if (restaurant.description && restaurant.description.length > 50) {
              restaurant.description = restaurant.description.substring(0, 50)
            }

            return ({
              ...restaurant.dataValues,
              FavoritedUsersCount: restaurant.FavoritedUsers.length,
              isFavorited: req.user.FavoritedRestaurants.some(favoritedRest => favoritedRest.id === restaurant.id)
            })
          })
          .sort((a, b) => b.FavoritedUsersCount - a.FavoritedUsersCount)
          .slice(0, 10)

        const results = { restaurants }
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  }
}

module.exports = restService
