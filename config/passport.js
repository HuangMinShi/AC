const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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










