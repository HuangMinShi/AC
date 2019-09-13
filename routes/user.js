const express = require('express')
const User = require('../models/user')
const router = express.Router()
const passport = require('passport')

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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
})
// 登出
router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/users/login')
})

module.exports = router