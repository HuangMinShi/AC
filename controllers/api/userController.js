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



}

module.exports = userController