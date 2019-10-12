const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const categoryList = require('../pubic/categoryList.json')

const db = require('../models')
const User = db.User
const Record = db.Record

// 列出全部
router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})

// 新增1筆頁面
router.get('/new', authenticated, (req, res) => {
  const record = {
    date: new Date().toLocaleString().split(' ')[0]
  }

  res.render('new', { record, categoryList })
})

// 新增1筆
router.post('/', authenticated, (req, res) => {
  const record = { ...req.body }
  const newRecord = new Record(record)
  newRecord.UserId = req.user.id

  newRecord
    .save()
    .then(record => {
      return res.redirect('/')
    })
    .catch(err => {
      return console.log(err)
    })

})

// 編輯1筆頁面
router.get('/:id/edit', authenticated, (req, res) => {
  res.render('edit')
})

// 編輯1筆
router.put('/:id/edit', authenticated, (req, res) => {
  res.redirect('/')
})

// 刪除1筆
router.delete('/:id/delete', authenticated, (req, res) => {
  res.redirect('/')
})

// 篩選多筆
router.delete('/filter', authenticated, (req, res) => {
  res.redirect('/')
})

module.exports = router