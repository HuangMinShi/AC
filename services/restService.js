const db = require('../models')
const { Restaurant, Category } = db

const pageLimit = 10

const restService = {
  getRestaurants: (req, res, cb) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    const findQuery = {
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit,
    }
    const promises = [Restaurant.findAndCountAll(findQuery), Category.findAll()]

    return Promise
      .all(promises)
      .then(findResults => {
        const [{ count, rows: restaurants }, categories] = findResults

        // pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = restaurants.map(restaurant => {

          if (restaurant.description && restaurant.description.length > 50) {
            restaurant.description = restaurant.description.substring(0, 50)
          }

          return ({
            ...restaurant.dataValues,
            isFavorited: req.user.FavoritedRestaurants.some(favoritedRest => favoritedRest.id === restaurant.id),
            isLiked: req.user.LikedRestaurants.some(likedRest => likedRest.id === restaurant.id)
          })
        })

        const results = {
          restaurants: data,
          categories,
          categoryId,
          page,
          pages,
          totalPage,
          prev,
          next
        }
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },
}

module.exports = restService