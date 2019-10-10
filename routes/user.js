const express = require('express')
const router = express.Router()


const db = require('../models')
const User = db.User
const Record = db.Record

// 註冊頁面
router.get('/register', (req, res) => {
  res.send('1')
})

// 註冊
router.post('/register', (req, res) => {
  res.send('2')
})

// 登入頁面
router.get('/login', (req, res) => {
  res.send('3')
})

// 登入
router.post('/login', (req, res) => {
  res.send('4')
})

// 登出
router.get('/logout', (req, res) => {
  res.redirect('/users/login')
})

module.exports = router