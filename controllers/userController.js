const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')

const db = require('../models')

const { User, Comment, Restaurant } = db

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
    const userId = Number(req.params.id)

    User
      .findByPk(userId, {
        include: [
          { model: Comment, include: [Restaurant] }
        ]
      })
      .then(results => {
        const userQueried = results.dataValues
        const resId = [], comments = []

        // 對 user 評論過的餐廳s 檢查重複
        userQueried.Comments.forEach(comment => {
          if (!resId.includes(comment.RestaurantId)) {
            resId.push(comment.RestaurantId)
            comments.push(comment)
          }
        })

        const count = comments.length
        // 取代 user 的 Comments 
        userQueried.Comments = comments
        return res.render('users/user', { userQueried, count })
      })
      .catch(err => {
        res.status(422).json(err)
        console.log(err)
      })
  },
  // 修改 profile頁面
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
  // 修改 profile
  putUser: (req, res) => {
    const userId = Number(req.params.id)

    if (userId !== req.user.id) {
      req.flash('error_msg', '不要輕舉妄動!')
      return res.redirect(`/users/${req.user.id}`)
    }

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
            .findByPk(userId)
            .then(userQueried => {
              return userQueried
                .update({
                  name: req.body.name,
                  image: file ? img.data.link : userQueried.image
                })
                .then(userQueried => {
                  req.flash('success_msg', '成功更新個人頁面')
                  res.redirect(`/users/${userId}`)
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
        .findByPk(userId)
        .then(userQueried => {
          return userQueried
            .update({
              name: req.body.name,
              image: userQueried.image
            })
            .then(userQueried => {
              req.flash('success_msg', '成功更新個人頁面')
              res.redirect(`/users/${userId}`)
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