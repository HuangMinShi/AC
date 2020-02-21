const imgur = require('imgur-node-api')

const db = require('../models')
const { Restaurant, Category, User } = db

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

  putRestaurant: (req, res, cb) => {
    let results = {
      status: 'success',
      message: '成功修改餐廳'
    }

    if (!req.body.name) {
      results = { status: 'failure', message: '名字不存在' }
      return cb(results)
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant
          .findByPk(req.params.id)
          .then(restaurant => {
            req.body.image = file ? img.data.link : restaurant.image
            return restaurant.update(req.body)
          })
          .then(() => {
            return cb(results)
          })
          .catch(err => {
            console.log(err)
          })
      })
    } else {
      return Restaurant
        .findByPk(req.params.id)
        .then(restaurant => {
          return restaurant.update(req.body)
        })
        .then(() => {
          return cb(results)
        })
        .catch(err => {
          res.status(500).json(err.toString())
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

  putUser: (req, res, cb) => {
    return User
      .findByPk(req.params.id)
      .then(user => {
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(user => {
        const results = {
          status: 'success',
          message: 'was successfully to update',
          email: user.email
        }

        return cb(results)
      })
      .catch(err => {
        // Internal Server Error ，伺服器遇到意外的情況，無法返回客戶端主機的請求
        return res.status(500).json(err.stack)
      })
  }
}

module.exports = adminService