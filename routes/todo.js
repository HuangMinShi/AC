const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const db = require('../models')
const Todo = db.Todo

// 列出全部
router.get('/', (req, res) => {
  res.redirect('/')
})
// 新增一筆頁面(順序須排在查看單筆前，因為查看單筆路由使用params將重疊)
router.get('/new', (req, res) => {
  res.render('new')
})
// 查看一筆
router.get('/:id', (req, res) => {
  res.render('detail')
})
// 新增一筆
router.post('/', (req, res) => {
  res.send('4')
})
// 編輯一筆頁面
router.get('/:id/edit', (req, res) => {
  res.render('edit')
})
// 編輯一筆
router.post('/:id/edit', (req, res) => {
  res.send('6')
})
// 刪除一筆
router.post('/:id/delete', (req, res) => {
  res.send('7')
})

module.exports = router