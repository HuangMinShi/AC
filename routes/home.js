const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const db = require('../models')
const Todo = db.Todo

// 首頁
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router