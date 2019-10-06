const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊提交
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  const errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '必填欄位不得為空' })
  }

  if (password !== password2) {
    errors.push({ message: '密碼輸入錯誤，請重新輸入' })
  }

  if (errors.length) {
    return res.render('register', { name, email, password, password2, errors })
  }

  User
    .findOne({ where: { email: email } })
    .then(user => {
      if (user) {
        errors.push({ message: '使用者已註冊過' })
        return res.render('register', { name, email, password, password2, errors })
      }

      const newUser = new User(req.body)
      bcrypt
        .genSalt(10)
        .then(salt => {
          return bcrypt.hash(newUser.password, salt)
        })
        .then(hash => {
          newUser.password = hash
          return newUser
        })
        .then(user => {
          user.save()
          return res.redirect('/users/login')
        })
        .catch(err => {
          return console.log(err)
        })

    })
    .catch(err => {
      return console.log(err)
    })
})

// 登入
router.get('/login', (req, res, ) => {
  res.render('login')
})

// 登入提交
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    // failureFlash: true,
    badRequestMessage: '請填寫email及password'
  })(req, res, next)
})

// 登出
router.get('/logout', (req, res) => {
  req.logOut()
  // req.flash('success_msg', '成功登出')
  res.redirect('/users/login')
})

module.exports = router