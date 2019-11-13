const fs = require('fs')
const imgur = require('imgur-node-api')

const db = require('../models')
const { Restaurant, User, Category } = db

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    return adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category
      .findAll()
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },

  postRestaurant: (req, res) => {
    return adminService.postRestaurant(req, res, (data) => {

      if (data.status === 'success') {
        req.flash('success_msg', data.message)
        return res.redirect('/admin/restaurants')
      } else {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }

    })
  },

  getRestaurant: (req, res) => {
    return adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id)
      .then(restaurant => {
        Category
          .findAll()
          .then(categories => {
            return res.render('admin/create', { restaurant, categories })
          })
      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', '名字不存在')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant
          .findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              CategoryId: req.body.categoryId,
              image: file ? img.data.link : restaurant.image
            })
              .then(restaurant => {
                req.flash('success_msg', '成功更新餐廳')
                return res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant
        .findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            CategoryId: req.body.categoryId,
            image: restaurant.image
          })
            .then(restaurant => {
              req.flash('success_msg', '成功更新餐廳')
              return res.redirect('/admin/restaurants')
            })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    return adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  editUsers: (req, res) => {
    return User
      .findAll()
      .then(users => {
        return res.render('admin/users',
          {
            users,
            user: req.user
          }
        )
      })
  },

  putUser: (req, res) => {
    return User
      .findByPk(req.params.id)
      .then(user => {
        user
          .update({ isAdmin: !user.isAdmin })
          .then(user => {
            req.flash('user_id_updated', `${req.params.id}`)
            req.flash('success_msg', 'was successfully to update')
            return res.redirect('/admin/users')
          })
      })
  }
}

module.exports = adminController