const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categoryList = require('../categoryList.json')
const { addUp, date, markEvenOrderList } = require('../libs/comFunc')
const { authenticated } = require('../config/auth')
const { checkRecord } = require('../config/validity')
let filterCategoryKey = ''


//列出全部
router.get('/', authenticated, (req, res) => {
  filterCategoryKey = ''
  res.redirect('/')
})

//新增1筆頁面
router.get('/new', authenticated, (req, res) => {
  const day = date()
  res.render('new', { day, categoryList })

})

//新增1筆
router.post('/', authenticated, checkRecord, (req, res) => {
  const newRecord = new Record(req.body)
  newRecord.userId = req.user._id

  newRecord.save(err => {
    if (err) return console.log(err)
    return filterCategoryKey ? res.redirect(`/records/filter?category=${filterCategoryKey}`) : res.redirect('/')
  })
})

//編輯1筆頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.log(err)
    const recordCategory = categoryList[record.category]
    return res.render('edit', { record, categoryList, recordCategory })
  })
})

//編輯1筆
router.put('/:id/edit', authenticated, checkRecord, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.log(err)
    Object.assign(record, req.body)
    record.save(err => {
      if (err) return console.log(err)
      return filterCategoryKey ? res.redirect(`/records/filter?category=${filterCategoryKey}`) : res.redirect('/')
    })
  })
})

//刪除1筆
router.delete('/:id/delete', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.log(err)
    return record.remove(err => {
      if (err) return console.log(err)
      return filterCategoryKey ? res.redirect(`/records/filter?category=${filterCategoryKey}`) : res.redirect('/')
    })
  })
})

//篩選類別
router.get('/filter', authenticated, (req, res) => {
  filterCategoryKey = req.query.category
  const filterCategory = categoryList[filterCategoryKey]
  Record.find({ category: filterCategoryKey, userId: req.user._id })
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)

      markEvenOrderList(records)
      const totalAmount = addUp(records)
      return res.render('index', { records, totalAmount, categoryList, filterCategory })
    })
})

module.exports = router