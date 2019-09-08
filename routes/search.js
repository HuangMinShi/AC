const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (req, res) => {
  console.log('1')
  const keyword = req.query.keyword
  const regExp = new RegExp(keyword, 'i')
  const { sortby, orderby } = req.query
  let objSort = new Object()
  objSort[sortby] = orderby

  Restaurant.find()
    .sort(objSort)
    .exec((err, restaurants) => {
      if (err) return console.log(err)

      let matchRestaurants = restaurants.filter(item => {
        return (item.name.match(regExp) || item.category.match(regExp))
      })

      res.render('index', { restaurants: matchRestaurants, keyword })
    })
})

module.exports = router