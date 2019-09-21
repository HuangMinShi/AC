const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//登入
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    // failureFlash: true,
    badRequestMessage: '請填寫 Email 及 Password '
  })(req, res, next)
})

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//註冊
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  User
    .findOne({ email: email })
    .then(user => {
      if (user) {
        // 使用者存在，回註冊頁。
        res.render('register', req.body)
      } else {
        // 新增使用者，回登入頁。
        const newUser = new User(req.body)

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash

            newUser
              .save()
              .then(user => {
                res.redirect('/')
              }).catch(err => {
                console.log(err)
              })
          })
        })
      }
    })
})

//登出
router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/users/login')
})

module.exports = router