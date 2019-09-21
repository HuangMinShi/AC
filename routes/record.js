const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const categoryList = require('../categoryList.json')
const { addUp, date } = require('../libs/comFunc')
const { authenticated } = require('../config/auth')
let categoryFilter = ''


//列出全部
router.get('/', authenticated, (req, res) => {
  categoryFilter = ''
  res.redirect('/')
})

//新增1筆頁面
router.get('/new', authenticated, (req, res) => {
  const today = date()
  res.render('new', { today, categoryList })

})

//新增1筆
router.post('/', authenticated, (req, res) => {
  const newRecord = new Record(req.body)
  newRecord.save(err => {
    if (err) return console.log(err)
    return categoryFilter ? res.redirect(`/records/filter?category=${categoryFilter}`) : res.redirect('/')
  })
})

//編輯1筆頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    const recordCategory = categoryList[record.category]
    return res.render('edit', { record, [recordCategory]: true })
  })
})

//編輯1筆
router.put('/:id/edit', authenticated, (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    Object.assign(record, req.body)
    record.save(err => {
      if (err) return console.log(err)
      return categoryFilter ? res.redirect(`/records/filter?category=${categoryFilter}`) : res.redirect('/')
    })
  })
})

//刪除1筆
router.delete('/:id/delete', authenticated, (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    return record.remove(err => {
      if (err) return console.log(err)
      return categoryFilter ? res.redirect(`/records/filter?category=${categoryFilter}`) : res.redirect('/')
    })
  })
})

//篩選類別
router.get('/filter', authenticated, (req, res) => {
  categoryFilter = req.query.category
  Record.find({ category: categoryFilter })
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)
      const totalAmount = addUp(records)
      return res.render('index', { records, totalAmount, categoryList })
    })
})

module.exports = router