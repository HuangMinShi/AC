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
    return Favorite
      .create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      .then(favorite => {
        req.flash('success_msg', '成功加入收藏')
        res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite
      .findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then(favorite => {
        favorite
          .destroy()
          .then(favorite => {
            req.flash('success_msg', '成功移除收藏')
            res.redirect('back')
          })
      })
  },

  like: (req, res) => {
    return Like
      .create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => {
        console.log(err)
      })
  },

  unlike: (req, res) => {
    return Like
      .findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then(liked => {
        liked
          .destroy()
          .then(() => {
            res.redirect('back')
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })

  },

  getTopUser: (req, res) => {
    return User
      .findAll({
        include:
          [
            { model: User, as: 'Followers' }
          ],
      })
      .then(users => {

        users = users
          .map(user => {
            // 若為 req.user 自己則新增 isUserSelf 送至 views 判斷
            if (user.id === req.user.id) user.dataValues.isUserSelf = true

            return ({
              ...user.dataValues,
              FollowerCount: user.Followers.length,
              isFollowed: req.user.Followings.some(followingUser => followingUser.id === user.id)
            })
          })
          .sort((a, b) => { b.FollowerCount - a.FollowerCount })

        return res.render('topUser', { users })
      })
      .catch(err => {
        console.log(err)
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