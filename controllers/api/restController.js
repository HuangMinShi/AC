const restService = require('../../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    return restService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

}

module.exports = restController