const db = require('../../models')
const app = require('../../app')

const chai = require('chai')
const request = require('supertest')

const should = chai.should()
const { User } = db

describe('# User controller', () => {
  describe('GET /signup', () => {
    it('[O] 成功取得註冊頁面', (done) => {
      request(app)
        .get('/signup')
        .end((err, res) => {
          res.statusCode.should.be.equal(200)
          res.text.should.be.contain('Sign Up')
          done()
        })
    })
  })

  describe('POST /signup', () => {
    beforeEach(() => {
      User.destroy({ where: {}, truncate: true })
    })

    it('[O] 註冊成功', (done) => {
      request(app)
        .post('/signup')
        .send('name=name&email=email&password=password&passwordCheck=password')
        .end((err, res) => {
          User
            .findOne({ where: { email: 'email' } })
            .then(user => {
              user.email.should.be.equal('email')
              done()
            })
            .catch(err => console.log(err))
        })
    })

    it('[X] 兩次密碼不同，註冊失敗', (done) => {
      request(app)
        .post('/signup')
        .send('name=name&email=email&password=a&passwordCheck=b')
        .end((err, res) => {
          res.statusCode.should.be.equal(302)
          res.text.should.be.contain('/signup')
          done()
        })
    })

    it('[X] 使用者已存在，註冊失敗', (done) => {
      User
        .create({ email: 'email' })
        .then(() => {
          request(app)
            .post('/signup')
            .send('name=name&email=email&password=password&passwordCheck=password')
            .end((err, res) => {
              res.statusCode.should.be.equal(302)
              res.text.should.be.contain('/signup')
              done()
            })
        })
        .catch(err => console.log(err))
    })

    afterEach(() => {
      User.destroy({ where: {}, truncate: true })
    })
  })

})



