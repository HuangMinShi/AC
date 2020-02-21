const restService = require('../../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    return restService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    return restService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  getFeeds: (req, res) => {
    return restService.getFeeds(req, res, (data) => {
      return res.json(data)
    })
  },

  getDashboard: (req, res) => {
    return restService.getDashboard(req, res, (data) => {
      return res.json(data)
    })
  },

  getTopRestaurants: (req, res) => {
    return restService.getTopRestaurants(req, res, (data) => {
      return res.json(data)
    })
  }

}

module.exports = restController