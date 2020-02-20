const express = require('express')
const router = express.Router()

const categoryList = require('../public/categoryList.json')
const { authenticated } = require('../config/auth')
const { sum } = require('../libs/calc')
const { genMonths, genYearsFrom } = require('../libs/date')

const db = require('../models')
const User = db.User
const Record = db.Record

// 首頁
router.get('/', authenticated, (req, res) => {
  User
    .findByPk(req.user.id)
    .then(user => {
      if (!user) return new Error('使用者不存在!')

      return Record.findAll({
        where: { userId: user.id },
        order: [['date', 'DESC']]
      })
    })
    .then(records => {

      const variables = {
        records,
        categoryList,
        totalAmount: sum(records),
        months: genMonths(),
        years: genYearsFrom(2010)
      }

      if (!records.length) {
        variables.default = "https://fakeimg.pl/540x100/f8f9fa/212529/?text=Have%20no%20records"
      }

      return res.render('index', variables)
    })
    .catch(err => {
      return console.log(err)
    })
})

module.exports = router