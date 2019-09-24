//  引入module
const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categoryList = require('../categoryList.json')

//  引入middleware and functions
const { authenticated } = require('../config/auth')
const { checkRecord } = require('../config/validity')
const { addUp, getFormatDate, getDayScope, markEvenOrderList } = require('../libs/comFunc')

//  宣告相關變數
let category = '', month = ''
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

//  列出全部
router.get('/', authenticated, (req, res) => {
  //  重置全域變數
  category = ''
  month = ''
  res.redirect('/')
})

//  新增1筆頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new', { date: getFormatDate(new Date()), categoryList })
})

//  新增1筆
router.post('/', authenticated, checkRecord, (req, res) => {
  const newRecord = new Record(req.body)
  newRecord.userId = req.user._id

  newRecord.save(err => {
    if (err) return console.log(err)

    //  操作後=>回篩選頁面
    return (category || month) ? res.redirect(`/records/filter?category=${category}&month=${month - 1}`) : res.redirect('/')
  })
})

//  編輯1筆頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.log(err)
    const category2Cn = categoryList[record.category]
    record.dateFormat = getFormatDate(record.date)
    return res.render('edit', { record, categoryList, category2Cn })
  })
})

//  編輯1筆
router.put('/:id/edit', authenticated, checkRecord, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.log(err)
    Object.assign(record, req.body)
    record.save(err => {
      if (err) return console.log(err)
      //  操作後=>回篩選頁面
      return (category || month) ? res.redirect(`/records/filter?category=${category}&month=${month - 1}`) : res.redirect('/')
    })
  })
})

//  刪除1筆
router.delete('/:id/delete', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.log(err)
    return record.remove(err => {
      if (err) return console.log(err)
      //  操作後=>回篩選頁面
      return (category || month) ? res.redirect(`/records/filter?category=${category}&month=${month - 1}`) : res.redirect('/')
    })
  })
})


//篩選類別
router.get('/filter', authenticated, (req, res) => {
  category = req.query.category || category
  month = Number(req.query.month) + 1 || month

  const category2Cn = categoryList[category]
  const options = {
    userId: req.user._id,
  }

  if (category) options.category = category
  if (month) options.date = getDayScope(month)

  Record.find(options)
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)

      records.forEach(record => {
        record.dateFormat = getFormatDate(record.date)
      })
      markEvenOrderList(records)
      const totalAmount = addUp(records)

      return res.render('index', { records, totalAmount, categoryList, category2Cn, months, month })
    })
})

module.exports = router