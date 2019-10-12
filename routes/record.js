const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')

const db = require('../models')
const User = db.User
const Record = db.Record

// 列出全部
router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})

// 新增1筆頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

// 新增1筆
router.post('/', authenticated, (req, res) => {
  res.redirect('/')
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