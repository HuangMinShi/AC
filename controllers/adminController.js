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
      console.log('不存在');

      req.flash('error_msg', '名字不存在')
      return res.redirect('back')
    }

    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    })
      .then(restaurant => {
        req.flash('success_msg', '成功建立餐廳')
        res.redirect('/admin/restaurants')
      })
  },

  getRestaurant: (req, res) => {
    return Restaurant
      .findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  }
}

module.exports = adminController