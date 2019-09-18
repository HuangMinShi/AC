const express = require('express')
const router = express.Router()
const Record = require('../models/record')

//列出全部
router.get('/', (req, res) => {
  res.redirect('/')
})
//新增1筆頁面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增1筆
router.post('/', (req, res) => {
  const newRecord = new Record(req.body)
  newRecord.save(err => {
    if (err) return console.log(err)
    return res.redirect('/records')
  })
})
//編輯1筆頁面
router.get('/:id/edit', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    return res.render('edit', { record })
  })
})
//編輯1筆
router.put('/:id/edit', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    Object.assign(record, req.body)
    record.save(err => {
      if (err) return console.log(err)
      return res.redirect('/')
    })
  })
})
//刪除1筆
router.delete('/:id/delete', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    return record.remove(err => {
      if (err) return console.log(err)
      return res.redirect('/')
    })
  })
})
//篩選類別
router.get('/filter', (req, res) => {
  Record.find({ category: req.query.category })
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