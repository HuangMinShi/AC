const db = require('../../models')
const app = require('../../app')
const auth = require('../../config/_auth')

const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')

const should = chai.should()
const { User } = db
describe('# Admin controller', () => {
  describe('GET /admin/restaurants/create - 未登入', () => {
    it('[X] 未登入狀態', (done) => {
      request(app)
        .get('/admin/restaurants/create')
        .end((err, res) => {
          res.statusCode.should.be.equal(302)
          done()
        })
    })
  })

  describe('GET /admin/restaurants/create - 登入', () => {
    before(() => {
      User.destroy({ where: {}, truncate: true })
      this.authenticate = sinon.stub(auth, 'isAuthenticated').returns(true)
      this.admin = sinon.stub(auth, 'isUserAdmin').returns(false)
    })

    it('[X] 登入狀態但非後台管理者', (done) => {
      request(app)
        .get('/admin/restaurants/create')
        .end((err, res) => {
          res.statusCode.should.be.equal(302)
          done()
        })
    })

    after(() => {
      User.destroy({ where: {}, truncate: true })
      this.authenticate.restore()
      this.admin.restore()
    })
  })

  describe('GET /admin/restaurants/create - 登入', () => {

    before(() => {
      User.destroy({ where: {}, truncate: true })

      this.authenticate = sinon.stub(auth, 'isAuthenticated').returns(true)
      this.admin = sinon.stub(auth, 'isUserAdmin').returns(true)
    })

    it('[O] 登入狀態且為後台管理者', (done) => {
      request(app)
        .get('/admin/restaurants/create')
        .end((err, res) => {
          res.statusCode.should.be.equal(200)
          res.text.should.be.contains('address')
          done()
        })
    })

    after(() => {
      User.destroy({ where: {}, truncate: true })
      this.authenticate.restore()
      this.admin.restore()
    })
  })
})




