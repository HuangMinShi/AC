const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { addUp } = require('../libs/comFunc')

//首頁
router.get('/', (req, res) => {
  Record.find()
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)
      const totalAmount = addUp(records)
      return res.render('index', { records, totalAmount })
    })
})

module.exports = router