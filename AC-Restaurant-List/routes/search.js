const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  const keyword = req.query.keyword
  const regExp = new RegExp(keyword, 'i')
  const { sortby, orderby } = req.query

  Restaurant.find({ userId: req.user._id })
    .sort({ [sortby]: orderby })
    .exec((err, restaurants) => {
      if (err) return console.log(err)

      let matchRestaurants = restaurants.filter(item => {
        return (item.name.match(regExp) || item.category.match(regExp))
      })

      res.render('index', { restaurants: matchRestaurants, keyword, sortby })
    })
})

module.exports = router