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
    .then(record => { return res.redirect('/') })
    .catch(err => { return console.log(err) })
})

// 編輯1筆頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User
    .findByPk(req.user.id)
    .then(user => {
      if (!user) return new Error('使用者不存在!')
      return Record.findOne({ where: { userId: req.user.id, id: req.params.id } })
    })
    .then(record => { return res.render('edit', { record, categoryList }) })
    .catch(err => { return console.log(err) })
})

// 編輯1筆
router.put('/:id/edit', authenticated, (req, res) => {
  Record
    .findOne({ where: { userId: req.user.id, id: req.params.id } })
    .then(record => {
      Object.assign(record, req.body)
      return record.save()
    })
    .then(record => { res.redirect('/') })
    .catch(err => { return console.log(err) })
})

// 刪除1筆
router.delete('/:id/delete', authenticated, (req, res) => {
  User
    .findByPk(req.user.id)
    .then(user => {
      if (!user) return new Error('使用者不存在!')
      return Record.destroy({ where: { userId: req.user.id, id: req.params.id } })
    })
    .then(record => { return res.redirect('/') })
    .catch(err => { return console.log(err) })
})

// 篩選多筆
router.delete('/filter', authenticated, (req, res) => {
  res.redirect('/')
})

module.exports = router