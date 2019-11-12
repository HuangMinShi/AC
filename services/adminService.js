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
      .catch(err => {
        console.log(err)
      })
  },

  getRestaurant: (req, res, cb) => {
    return Restaurant
      .findByPk(req.params.id,
        {
          include: [Category]
        }
      )
      .then(restaurant => {
        const options = { restaurant }
        return cb(options)
      })
      .catch(err => {
        console.log(err)
      })
  },

  deleteRestaurant: (req, res, cb) => {
    return Restaurant
      .findByPk(req.params.id)
      .then(restaurant => {
        return restaurant.destroy()
      })
      .then(() => {
        const results = {
          status: 'success',
          message: ''
        }

        return cb(results)
      })
      .catch(err => {
        console.log(err)
      })
  },
}

module.exports = adminService