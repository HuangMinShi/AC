const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const db = require('../models')
const { User, Restaurant } = db

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, done) => {
    User
      .findOne({ where: { email: email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_msg', 'email尚未註冊'))

        if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_msg', '密碼輸入錯誤'))

        return done(null, user)
      })
      .catch(err => {
        console.log(err);
      })
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User
    .findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    })
    .then(user => {
      return done(null, user)
    })
    .catch(err => {
      console.log(err);
    })
})

module.exports = passport