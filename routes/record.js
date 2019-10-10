const express = require('express')
const router = express.Router()

// 列出全部
router.get('/', (req, res) => {
  res.redirect('/')
})

// 新增1筆頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增1筆
router.post('/', (req, res) => {
  res.redirect('/')
})

// 編輯1筆頁面
router.get('/:id/edit', (req, res) => {
  res.render('edit')
})

// 編輯1筆
router.put('/:id/edit', (req, res) => {
  res.redirect('/')
})

// 刪除1筆
router.delete('/:id/delete', (req, res) => {
  res.redirect('/')
})

// 篩選多筆
router.delete('/filter', (req, res) => {
  res.redirect('/')
})

module.exports = router