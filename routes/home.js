//  引入module
const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categoryList = require('../categoryList.json')

//  引入middleware and functions
const { authenticated } = require('../config/auth')
const { addUp, markEvenOrderList, getFormatDate } = require('../libs/comFunc')

//  宣告相關變數
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

//  首頁
router.get('/', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)

      records.forEach(record => {
        //  1.迭代新增dateFormat屬性
        record.dateFormat = getFormatDate(record.date)
        //  2.但console.log(record)，發現沒有dateFormat屬性
        //  3.可嘗試存取dateFormat屬性，又發現明明有賦值?
      })

      //  標註偶數序列
      markEvenOrderList(records)
      //  加總金額
      const totalAmount = addUp(records)
      return res.render('index', { records, totalAmount, categoryList, months })
    })
})

module.exports = router