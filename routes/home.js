const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const db = require('../models')
const User = db.User
const Todo = db.Todo

// 首頁
router.get('/', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('User doesn\'t exists.')

      return Todo.findAll({ where: { UserId: user.id } })
    })
    .then(todos => {
      return res.render('index', { todos })
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

module.exports = router