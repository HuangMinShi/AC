const bcrypt = require('bcryptjs')
const passport = require('../config/passport')
const imgur = require('imgur-node-api')

const userService = require('../services/userService')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_msg', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User
        .findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_msg', '信箱重複')
            return res.redirect('/signup')
          } else {
            User
              .create({
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              })
              .then(user => {
                req.flash('success_msg', '成功註冊帳號')
                return res.redirect('/signin')
              })
              .catch(err => {
                console.log(err);
              })
          }
        })
    }
  },

  signInPage: (req, res) => {
    // const email = 'z7707092004@gmail.com'
    // const password = '1'

    return res.render('signin')
  },

  signIn: (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return console.log(err)

      if (!user) {
        const email = req.body.email
        const password = req.body.password
        let error_msg = req.flash('error_msg')

        if (!email || !password) error_msg = '請輸入 email 及 password'

        return res.render('signin', { email, error_msg })
      }

      req.login(user, err => {
        if (err) return console.log(err)

        req.flash('success_msg', '成功登入')
        res.redirect('/restaurants')
      })

    })(req, res)
  },

  logout: (req, res) => {
    req.flash('success_msg', '成功登出')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return userService.getUser(req, res, (data) => {
      return res.render('users/user', data)
    })
  },

  editUser: (req, res) => {
    const userId = Number(req.params.id)

    if (userId !== req.user.id) {
      req.flash('error_msg', '不要輕舉妄動!')
      return res.redirect(`/users/${req.user.id}`)
    }

    return User
      .findByPk(userId)
      .then(userQueried => {
        return res.render('users/edit')
      })
      .catch(err => {
        console.log(err)
      })
  },

  putUser: (req, res) => {
    return userService.putUser(req, res, (data) => {
      if (data.status === 'failure') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }

      req.flash('success_msg', data.message)
      return res.redirect(`/users/${data.userId}`)
    })
  },

  addFavorite: (req, res) => {
    return userService.addFavorite(req, res, (data) => {
      req.flash('success_msg', data.message)
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return userService.removeFavorite(req, res, (data) => {
      req.flash('success_msg', data.message)
      return res.redirect('back')
    })
  },

  like: (req, res) => {
    return userService.like(req, res, (data) => {
      return res.redirect('back')
    })
  },

  unlike: (req, res) => {
    return userService.unlike(req, res, (data) => {
      return res.redirect('back')
    })
  },

  getTopUser: (req, res) => {
    return userService.getTopUser(req, res, (data) => {
      return res.render('topUser', data)
    })
  },

  addFollowing: (req, res) => {
    return Followship
      .create({
        followerId: req.user.id,
        followingId: Number(req.params.userId)
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => {
        console.log(err)
      })
  },

  removeFollowing: (req, res) => {
    return Followship
      .findOne({
        where:
        {
          followerId: req.user.id,
          followingId: Number(req.params.userId)
        }
      })
      .then(followship => {
        return followship.destroy()
      })
      .then(() => {
        return res.redirect('back')
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = userController