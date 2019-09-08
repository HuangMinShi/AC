const express = require('express')
const Restaurant = require('../models/restaurant')
const router = express.Router()

// 首頁
router.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants })
  })
})

module.exports = router