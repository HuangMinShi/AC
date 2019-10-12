const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')

const db = require('../models')
const User = db.User
const Record = db.Record

// 首頁
router.get('/', authenticated, (req, res) => {

  res.render('index')
})

module.exports = router