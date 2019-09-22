const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    User
      .findOne({ email: profile._json.email })
      .then(user => {
        if (!user) {
          // Email不存在=>產生隨機密碼=>加鹽=>存進資料庫
          const newUser = new User(profile._json)

          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash

              newUser
                .save()
                .then(user => {
                  return done(null, user)
                })
                .catch(err => {
                  console.log(err)
                })
            })
          })
        } else {
          // 登入
          return done(null, user)
        }
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