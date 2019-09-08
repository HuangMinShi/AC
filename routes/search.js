const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  const keyword = req.query.keyword
  const regExp = new RegExp(keyword, 'i')

  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)

    let matchRestaurants = restaurants.filter(item => {
      return (item.name.match(regExp) || item.category.match(regExp))
    })

    res.render('index', { restaurants: matchRestaurants, keyword })
  })
})

module.exports = router