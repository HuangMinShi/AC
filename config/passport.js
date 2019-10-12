const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

module.exports = (passport) => {

  passport.use(new LocalStrategy(
    { usernameField: 'email' }, (email, password, done) => {
      User
        .findOne({
          where: {
            email: email
          }
        })
        .then(user => {
          if (!user) return done(null, false, { message: 'Incorrect email.' })

          bcrypt
            .compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) return done(null, false, { message: 'Incorrect password.' })

              return done(null, user)
            })
        })
    }
  ))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = { ...profile._json }

    User
      .findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          const password = Math.random().toString(36).slice(-8)

          bcrypt
            .genSalt(10)
            .then(salt => {
              return bcrypt.hash(password, salt)
            })
            .then(hash => {
              const userNew = new User({
                name: name,
                email: email,
                password: hash
              })

              return userNew.save()
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
  })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
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










