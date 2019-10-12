const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const { sum } = require('../libs/calcAmount')

const db = require('../models')
const User = db.User
const Record = db.Record

// 首頁
router.get('/', authenticated, (req, res) => {
  User
    .findByPk(req.user.id)
    .then(user => {
      if (!user) return new Error('使用者不存在!')
      return Record.findAll({ where: { userId: user.id } })
    })
    .then(records => {
      const totalAmount = sum(records)
      return res.render('index', { records, totalAmount })
    })
    .catch(err => {
      return console.log(err)
    })
})

module.exports = router