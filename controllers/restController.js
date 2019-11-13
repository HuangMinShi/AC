const db = require('../models')
const { Restaurant, Category, User, Comment, sequelize } = db

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
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
      .then(results => {
        const [{ count, rows: restaurants }, categories] = results

        // pagination
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(count / pageLimit)
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1

        const data = restaurants.map(restaurant => {

          if (restaurant.description > 50) {
            restaurant.description = restaurant.description.slice(0, 50)
          }

          return ({
            ...restaurant.dataValues,
            isFavorited: req.user.FavoritedRestaurants.some(favoritedRest => favoritedRest.id === restaurant.id),
            isLiked: req.user.LikedRestaurants.some(likedRest => likedRest.id === restaurant.id)
          })
        })

        const options = {
          restaurants: data,
          categories,
          categoryId,
          page,
          pages,
          totalPage,
          prev,
          next
        }

        return res.render('restaurants', options)
      })
      .catch(err => {
        console.log(err)
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(favoriteduser => favoriteduser.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(likedUser => likedUser.id === req.user.id)
        return res.render('restaurant', { restaurant, isFavorited, isLiked })
      })
      .catch(err => {
        console.log(err)
      })
  },

  getFeeds: (req, res) => {
    const promises = [
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
        include: [User, Restaurant]
      })
    ]

    return Promise
      .all(promises)
      .then(results => {
        const [restaurants, comments] = results
        return res.render('feeds', { restaurants, comments })
      })
      .catch(err => {
        console.log(err)
      })
  },

  getDashboard: (req, res) => {
    return Restaurant
      .findByPk(req.params.id, {

        attributes: [
          'id',
          'name',
          'viewCounts',
          [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCounts'],
          [sequelize.col('Category.name'), 'categoryName']
        ],
        include: [
          // exclude Comment primary key 
          { model: Category, attributes: [] },
          { model: Comment, attributes: [] }
        ],
        group: ['Restaurant.id', 'Category.name']

      })
      .then(r => {
        r.increment('viewCounts', { by: 1 })

        // 展開成 plain js object, 不然 categoryName 抓不到
        const restaurant = { ...r.dataValues }

        return res.render('dashboard', { restaurant })
      })
      .catch(err => {
        console.log(err)
      })
  },

  getTopRestaurants: (req, res) => {
    return Restaurant
      .findAll({
        include: [
          { model: User, as: 'FavoritedUsers' }
        ]
      })
      .then(restaurants => {
        restaurants = restaurants
          .map(restaurant => {

            if (restaurant.description > 50) {
              restaurant.description = restaurant.description.slice(0, 50)
            }

            return ({
              ...restaurant.dataValues,
              FavoritedUsersCount: restaurant.FavoritedUsers.length,
              isFavorited: req.user.FavoritedRestaurants.some(favoritedRest => favoritedRest.id === restaurant.id)
            })
          })
          .sort((a, b) => b.FavoritedUsersCount - a.FavoritedUsersCount)
          .slice(0, 10)

        return res.render('topRestaurants', { restaurants })
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = restController
