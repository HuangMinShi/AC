const imgur = require('imgur-node-api')

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

  postRestaurant: (req, res, cb) => {
    const results = {
      status: 'success',
      message: '成功建立餐廳'
    }

    if (!req.body.name) {
      results.status = 'failure'
      results.message = '名字不存在'
      return cb(results)
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        req.body.image = file ? img.data.link : null

        return Restaurant
          .create(req.body)
          .then(restaurant => {
            return cb(results)
          })
          .catch(err => {
            console.log(err)
          })
      })
    } else {
      req.body.image = null

      return Restaurant
        .create(req.body)
        .then(restaurant => {
          return cb(results)
        })
        .catch(err => {
          console.log(err)
        })
    }
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