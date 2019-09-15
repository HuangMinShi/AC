const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { authenticated } = require('../config/auth')

// 首頁
router.get('/', authenticated, (req, res) => {
  const { sortby, orderby } = req.query
  Restaurant.find({ userId: req.user._id })
    .sort({ [sortby]: orderby })
    .exec((err, restaurants) => {
      if (err) return console.log(err)
      return res.render('index', { restaurants, sortby, orderby })
    })
})

module.exports = router