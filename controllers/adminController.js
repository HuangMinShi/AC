const fs = require('fs')
const imgur = require('imgur-node-api')

const IMGUR_CLIENT_ID = '8c995c2bae122f6'

const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant
      .findAll()
      .then(restaurants => {
        return res.render('admin/restaurants',
          {
            restaurants,
            user: req.user,
            isAuthenticated: req.isAuthenticated
          })
      })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', '名字不存在')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        })
          .then(restaurant => {
            req.flash('success_msg', '成功建立餐廳')
            res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      })
        .then(restaurant => {
          req.flash('success_msg', '成功建立餐廳')
          res.redirect('/admin/restaurants')
        })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  },

  editRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/create', { restaurant })
      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', '名字不存在')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
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
              image: file ? img.data.lonk : restaurant.image
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
    return Restaurant
      .findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminController