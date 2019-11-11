const db = require('../../models')
const { Restaurant, Category } = db

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant
      .findAll({ include: [Category] })
      .then(restaurants => {
        return res.json(
          {
            restaurants,
            user: req.user,
            isAuthenticated: req.isAuthenticated
          })
      })
  },
}

module.exports = adminController








