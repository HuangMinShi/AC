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
    return restService.getTopRestaurants(req, res, (data) => {
      return res.render('topRestaurants', data)
    })
  }
}

module.exports = restController
