const db = require('../models')
const { Restaurant, Category } = db

const restController = {
  getRestaurants: (req, res) => {
    return Restaurant
      .findAll({ include: Category })
      .then(restaurants => {

        const data = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))

        return res.render('restaurants', { restaurants: data })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        console.log(restaurant);

        return res.render('restaurant', { restaurant })
      })
  }
}

module.exports = restController