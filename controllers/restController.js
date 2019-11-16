const db = require('../models')
const { Restaurant, Category, User, Comment, sequelize } = db

const restService = require('../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    return restService.getRestaurants(req, res, (data) => {
      return res.render('restaurants', data)
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
        restaurant.increment('viewCounts', { by: 1 })

        const isFavorited = restaurant.FavoritedUsers.some(favoriteduser => favoriteduser.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(likedUser => likedUser.id === req.user.id)
        return res.render('restaurant', { restaurant, isFavorited, isLiked })
      })
      .catch(err => {
        console.log(err)
      })
  },

  getFeeds: (req, res) => {
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
      .then(results => {
        const [restaurants, comments] = results
        return res.render('feeds', { restaurants, comments })
      })
      .catch(err => {
        console.log(err)
      })
  },

  getDashboard: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, {

        attributes: [
          'id',
          'name',
          'viewCounts',
          [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCounts'],
          [sequelize.col('Category.name'), 'categoryName']
        ],
        include: [
          // exclude Comment primary key 
          { model: Category, attributes: [] },
          { model: Comment, attributes: [] }
        ],
        group: ['Restaurant.id', 'Category.name']

      })
      .then(r => {
        // 展開成 plain js object, 不然 categoryName 抓不到
        const restaurant = { ...r.dataValues }

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

        return res.render('topRestaurants', { restaurants })
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = restController
