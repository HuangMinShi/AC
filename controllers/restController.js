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
    return restService.getRestaurant(req, res, (data) => {
      return res.render('restaurant', data)
    })
  },

  getFeeds: (req, res) => {
    return restService.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },

  getDashboard: (req, res) => {
    return restService.getDashboard(req, res, (data) => {
      return res.render('dashboard', data)
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
