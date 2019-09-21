const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
          }

          // bcrypt.compare(str, hash, callback)
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Email或Password輸入錯誤' })
            }
          })
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