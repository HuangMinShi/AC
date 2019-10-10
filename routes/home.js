const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User
const Record = db.Record

// 首頁
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router