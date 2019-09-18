const express = require('express')
const router = express.Router()
const Record = require('../models/record')

//首頁
router.get('/', (req, res) => {
  Record.find()
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)

      const amountList = records.map(item => Number(item.amount))
      let totalAmount = 0
      if (amountList.length) {
        totalAmount = amountList.reduce((p, c) => p + c)
      }

      return res.render('index', { records, totalAmount })
    })
})

module.exports = router