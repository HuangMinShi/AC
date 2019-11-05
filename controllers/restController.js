


const db = require('../models')
const { Restaurant, Category } = db

const restController = {
  getRestaurants: (req, res) => {
    Restaurant
      .findAll({ include: Category })
      .then(restaurants => {

        const data = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))

        return res.render('restaurants', { restaurants: data })
      })
  }
}

module.exports = restController