const userService = require('../../services/userService')
const db = require('../../models')
const { User } = db

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {

  signIn: (req, res) => {
    let results = {
      status: 'failure',
      message: ''
    }

    if (!req.body.email || !req.body.password) {
      results.message = '需要欄位不存在'
      return res.json(results)
    }

    const username = req.body.email
    const password = req.body.password

    User
      .findOne({ where: { email: username } })
      .then(user => {
        if (!user) {
          results.message = '找不到使用者'
          return res.status(401).json(results)
        }

        if (!bcrypt.compareSync(password, user.password)) {
          results.message = '輸入密碼錯誤'
          return res.status(401).json(results)
        }

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        results = {
          status: 'success',
          message: 'ok',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        }

        return res.json(results)
      })
      .catch(err => {
        console.log(err)
      })
  },

  signUp: (req, res) => {
    let results = {
      status: 'failure',
      message: ''
    }

    if (req.body.passwordCheck !== req.body.password) {
      results.message = '兩次密碼輸入不同'
      return res.json(results)
    }

    return User
      .findOne({ where: { email: req.body.email } })
      .then(user => {

        if (user) {
          results.message = '信箱重複'
          return res.json(results)
        } else {
          User
            .create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
            })
            .then(user => {
              results = { status: 'success', message: '註冊成功' }
              return res.json(results)
            })
        }

      })
      .catch(err => {
        console.log(err)
      })
  },

  getUser: (req, res) => {
    return userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },

  putUser: (req, res) => {
    return userService.putUser(req, res, (data) => {
      return res.json(data)
    })
  },

  getTopUser: (req, res) => {
    return userService.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },

  addFavorite: (req, res) => {
    return userService.addFavorite(req, res, (data) => {
      return res.json(data)
    })
  },

  removeFavorite: (req, res) => {
    return userService.removeFavorite(req, res, (data) => {
      return res.json(data)
    })
  },

  like: (req, res) => {
    return userService.like(req, res, (data) => {
      return res.json(data)
    })
  },

  unlike: (req, res) => {
    return userService.unlike(req, res, (data) => {
      return res.json(data)
    })
  },

  addFollowing: (req, res) => {
    return userService.addFollowing(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = userController