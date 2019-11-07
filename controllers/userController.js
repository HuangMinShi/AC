const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const db = require('../models')

const { User } = db

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
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '成功登出')
    req.logout()
    res.redirect('/signin')
  },
  // 瀏覽 profile
  getUser: (req, res) => {

    return User
      .findByPk(req.params.id)
      .then(user => {
        res.render('users/user', { user })
      })
      .catch(err => {
        console.log(err)
      })

  },
  // 修改 profile頁面
  editUser: (req, res) => {
    return User
      .findByPk(req.params.id)
      .then(user => {
        res.render('users/edit', { user })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 修改 profile
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', '請輸入姓名')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur
        .upload(file.path, (err, img) => {
          return User
            .findByPk(req.params.id)
            .then(user => {
              return user
                .update({
                  name: req.body.name,
                  image: file ? img.data.link : user.image
                })
                .then(user => {
                  req.flash('success_msg', '成功更新個人頁面')
                  res.redirect(`/users/${req.params.id}`)
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => {
              console.log(err)
            })
        })
    } else {
      return User
        .findByPk(req.params.id)
        .then(user => {
          user
            .update({
              name: req.body.name,
              image: user.image
            })
            .then(user => {
              req.flash('success_msg', '成功更新個人頁面')
              res.redirect(`/users/${req.params.id}`)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}

module.exports = userController