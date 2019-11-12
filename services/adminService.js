const db = require('../models')
const { Restaurant, Category } = db

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant
      .findAll({ include: [Category] })
      .then(restaurants => {
        const options = { restaurants }
        return callback(options)
      })
  },
}

module.exports = adminService