const express = require('express')
const User = require('../models/user')
const router = express.Router()

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})
// 註冊提交
router.post('/register', (req, res) => {
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        console.log('User already exists!')
        res.render('register', req.body)
      } else {
        const newUser = new User(req.body)
        newUser
          .save()
          .then(user => {
            res.redirect('/')
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
})
// 登入
router.get('/login', (req, res) => {
  res.render('login')
})
// 登入提交
router.post('/login', (req, res) => {
  res.send('登入')
})
// 登出
router.get('/logout', (req, res) => {
  res.send('登出')
})

module.exports = router