const express = require('express')
const Restaurant = require('../models/restaurant')
const router = express.Router()

// 首頁
router.get('/', (req, res) => {
  const { sortby, orderby } = req.query
  let objSort = new Object()
  objSort[sortby] = orderby

  Restaurant.find()
    .sort(objSort)
    .exec((err, restaurants) => {
      if (err) return console.log(err)
      return res.render('index', { restaurants })
    })
})

module.exports = router