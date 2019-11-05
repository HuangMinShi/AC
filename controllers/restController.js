const db = require('../models')
const { Restaurant, Category } = db

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }

    return Restaurant
      .findAll({ include: Category, where: whereQuery })
      .then(restaurants => {
        const data = restaurants.map(restaurant => ({
          ...restaurant.dataValues,
          description: restaurant.dataValues.description.substring(0, 50)
        }))

        Category
          .findAll()
          .then(categories => {
            console.log(categoryId);

            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId
            })
          })
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        return res.render('restaurant', { restaurant })
      })
  }
}

module.exports = restController