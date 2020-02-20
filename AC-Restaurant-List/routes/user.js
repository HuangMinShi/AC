const express = require('express')
const User = require('../models/user')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})
// 註冊提交
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []

  if (!email || !password || !password2) {
    errors.push({ message: '請輸入Email及Password。' })
  }

  if (password !== password2) {
    errors.push({ message: 'Password輸入錯誤，請重新輸入。' })
  }

  if (errors.length > 0) {
    res.render('register', { name, email, password, password2, errors })
  } else {
    User
      .findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ message: '這個Email已經註冊過了' })
          res.render('register', { name, email, password, password2, errors })
        } else {
          const newUser = new User(req.body)

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash
              newUser.name = req.body.name || 'Anonymous'

              newUser
                .save()
                .then(user => {
                  res.redirect('/')
                })
                .catch(err => {
                  console.log(err)
                })
            })
          })
        }
      })
  }
})
// 登入
router.get('/login', (req, res) => {
  res.locals.loginError = req.flash('error')
  res.render('login')
})
// 登入提交
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    badRequestMessage: '請輸入Email及Password'
  })(req, res, next)
})
// 登出
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已經成功登出了')
  res.redirect('/users/login')
})

module.exports = router