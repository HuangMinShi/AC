const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')



const db = require('../models')
const User = db.User
const Record = db.Record

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  const errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '必填欄位不得為空!' })
  }

  if (password !== password2) {
    errors.push({ message: '密碼輸入錯誤，請重新輸入!' })
  }

  if (errors.length) {
    return res.render('register', { name, email, password, password2, errors })
  } else {

    User
      .findOne({
        where: {
          email: email
        }
      })
      .then(user => {

        if (user) {
          errors.push({ message: 'email已註冊過，請重新註冊!' })
          res.render('register', { name, email, password, password2, errors })
        }

        const userNew = new User(req.body)
        bcrypt
          .genSalt(10)
          .then(salt => {
            return bcrypt.hash(userNew.password, salt)
          })
          .then(hash => {
            userNew.password = hash
            userNew.save()
            res.redirect('/users/login')
          })
          .catch(err => {
            return console.log(err)
          })
      })
  }
})

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login', { email: req.flash('email') })
})

// 登入
router.post('/login', (req, res, next) => {
  req.flash('email', req.body.email)

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    badRequestMessage: '請填寫email及password'
  })(req, res, next)
})

// 登出
router.get('/logout', (req, res) => {
  res.redirect('/users/login')
})

module.exports = router