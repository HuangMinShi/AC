const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { checkEmail } = require('../config/validity')

//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//登入
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    badRequestMessage: '請填寫 Email 及 Password '
  })(req, res, next)
})

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//註冊
router.post('/register', checkEmail, (req, res) => {
  const { name, email, password, password2 } = req.body

  // 顯示錯誤訊息
  let errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '必填欄位不得為空!' })
  }

  if (password !== password2) {
    errors.push({ message: '密碼輸入錯誤，請重新輸入!' })
  }

  if (errors.length > 0) {
    res.render('register', { name, email, password, password2, errors })
  } else {
    User
      .findOne({ email: email })
      .then(user => {
        if (user) {
          // 使用者存在，回註冊頁。
          errors.push({ message: '使用者已存在' })
          res.render('register', { name, email, password, password2, errors })
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
  }
})

//登出
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '成功登出')
  res.redirect('/users/login')
})

module.exports = router