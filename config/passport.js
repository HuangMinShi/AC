const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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



  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    User
      .findOne({ where: { email: profile._json.email } })
      .then(user => {
        if (!user) {
          // const newUser = new User(profile._json) don't do that! bcz profile._json.id === `Todos`.`id`
          const newUser = new User({
            name: profile._json.name,
            email: profile._json.email,
          })

          bcrypt
            .genSalt(10)
            .then(salt => {
              const randomPassword = Math.random().toString(36).slice(-8)
              return bcrypt.hash(randomPassword, salt)
            })
            .then(hash => {
              newUser.password = hash
              // return user.save()後的使用者才有mysql產生的id
              return newUser.save()
            })
            .then(user => {
              return done(null, user)
            })
            .catch(err => {
              return console.log(err)
            })

        } else {
          return done(null, user)
        }
      })
      .catch(err => {
        return console.log(err)
      })
  }
  ))

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