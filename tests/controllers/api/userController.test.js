const db = require('../../../models')
const app = require('../../../app')
const passport = require('../../../config/passport')

const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')

const should = chai.should()
const { User } = db

describe('# User controller api', () => {
  describe('POST /api/signup', () => {

    before(() => User.destroy({ where: {}, truncate: true }))

    after(() => User.destroy({ where: {}, truncate: true }))

    it('[O] 註冊成功', (done) => {
      request(app)
        .post('/api/signup')
        .send('name=name&email=email&password=password&passwordCheck=password')
        .expect(200)
        .end((err, res) => {

          // 條件一 成功回傳資料
          res.body.status.should.be.equal('success')
          // 條件二 成功寫入資料庫
          User
            .findOne({ where: { email: 'email' } })
            .then(user => {
              user.email.should.be.equal('email')
              err ? done(err) : done()
            })
            .catch(err => console.log(err))
        })
    })

    it('[X] 兩次密碼不同', (done) => {
      request(app)
        .post('/api/signup')
        .send('name=name&email=email&password=a&passwordCheck=b')
        .expect(200)
        .end((err, res) => {

          // 條件一 回傳 json 顯示失敗
          res.body.status.should.be.equal('failure')
          // 條件二 檢查回傳訊息
          res.body.message.should.be.equal('兩次密碼輸入不同')
          err ? done(err) : done()
        })
    })

    it('[X] 信箱重複', (done) => {
      request(app)
        .post('/api/signup')
        .send('name=name&email=email&password=password&passwordCheck=password')
        .expect(200)
        .end((err, res) => {

          // 條件一 回傳 json 顯示失敗
          res.body.status.should.be.equal('failure')
          // 條件二 檢查回傳訊息
          res.body.message.should.be.equal('信箱重複')
          err ? done(err) : done()
        })
    })

  })

  describe('POST /api/signin', () => {

    before(async () => {
      await User.destroy({ where: {}, truncate: true })

      // 先註冊
      await request(app)
        .post('/api/signup')
        .send('name=name&email=email&password=password&passwordCheck=password')
    })

    after(async () => await User.destroy({ where: {}, truncate: true }))

    it('[O] 登入成功', (done) => {
      request(app)
        .post('/api/signin')
        .send('email=email&password=password')
        .expect(200)
        .end((err, res) => {

          // 成功回傳資料
          res.body.status.should.be.equal('success')
          res.body.token.length.should.be.above(0)
          err ? done(err) : done()
        })
    })

    it('[X] 未輸入必填欄位', (done) => {
      request(app)
        .post('/api/signin')
        .send('')
        .expect(200)
        .end((err, res) => {

          // 條件一 回傳資料狀態顯示失敗
          res.body.status.should.be.equal('failure')
          // 條件二：檢查回傳資料訊息
          res.body.message.should.be.equal('需要欄位不存在')
          err ? done(err) : done()
        })
    })

    it('[X] 找不到用戶', (done) => {
      request(app)
        .post('/api/signin')
        .send('email=email2&password=password')
        .expect(401)
        .end((err, res) => {

          // 條件一 回傳資料狀態顯示失敗
          res.body.status.should.be.equal('failure')
          // 條件二：檢查回傳資料訊息
          res.body.message.should.be.equal('找不到使用者')
          err ? done(err) : done()
        })
    })

    it('[X] 輸入密碼錯誤', (done) => {
      request(app)
        .post('/api/signin')
        .send('email=email&password=password2')
        .expect(401)
        .end((err, res) => {

          // 條件一 回傳資料狀態顯示失敗
          res.body.status.should.be.equal('failure')
          // 條件二：檢查回傳資料訊息
          res.body.message.should.be.equal('輸入密碼錯誤')
          err ? done(err) : done()
        })
    })

    it('[X] 未註冊，直接登入', (done) => {
      request(app)
        .post('/api/signin')
        .send('email=email2&password=password2')
        .expect(401)
        .end((err, res) => {

          // 條件一 回傳資料狀態顯示失敗
          res.body.status.should.be.equal('failure')
          // 條件二：檢查回傳資料訊息
          should.equal(res.body.token, undefined)
          err ? done(err) : done()
        })
    })
  })
})
