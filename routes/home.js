const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categoryList = require('../categoryList.json')
const { addUp } = require('../libs/comFunc')
const { authenticated } = require('../config/auth')

//首頁
router.get('/', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)
      const totalAmount = addUp(records)
      return res.render('index', { records, totalAmount, categoryList })
    })
})

module.exports = router