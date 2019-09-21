const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = passport => {

  passport.use(new LocalStrategy(
    { usernameField: 'email' }, (email, password, done) => {
      User
        .findOne({ email: email })
        .then(user => {

          if (!user) {
            // 使用者未註冊，回登入頁。
            console.log('使用者未註冊，回登入頁。')
            return done(null, false, { message: 'Email尚未註冊' })
          } else if (password !== user.password) {
            // 使用者輸入密碼錯誤，回登入頁。
            console.log('使用者輸入密碼錯誤，回登入頁。')
            return done(null, false, { message: '輸入密碼錯誤' })
          }

          return done(null, user)
        }).catch(err => {
          console.log(err)
        })
    }))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      return done(null, user)
    })
  })














}