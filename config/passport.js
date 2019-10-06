const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

module.exports = passport => {
  passport.use(new LocalStrategy(
    { usernameField: 'email' }, (email, password, done) => {
      User
        .findOne({ where: { email: email } })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'email尚未註冊' })
          }

          bcrypt
            .compare(password, user.password)
            .then(match => {
              if (!match) return done(null, false, { message: 'email 或 password輸入錯誤' })

              return done(null, user)
            })
            .catch(err => {
              return console.log(err)
            })

        })
        .catch(err => {
          return console.log(err)
        })
    }))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User
      .findByPk(id)
      .then(user => {
        return done(null, user)
      })
      .catch(err => {
        return console.log(err)
      })
  })
}