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
      .catch(err => res.status(500).json(err.stack))
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
    return adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'failure') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }

      req.flash('success_msg', data.message)
      return res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    return adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('error_msg', '成功刪除餐廳')
        return res.redirect('/admin/restaurants')
      }
    })
  },

  editUsers: (req, res) => {
    return User
      .findAll()
      .then(users => {
        return res.render('admin/users', { users })
      })
  },

  putUser: (req, res) => {
    return adminService.putUser(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success_msg', data.message)
        req.flash('updatedUserEmail', data.email)
        return res.redirect('/admin/users')
      }
    })
  }
}

module.exports = adminController