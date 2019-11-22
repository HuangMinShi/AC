const db = require('../../models')
const app = require('../../app')
const auth = require('../../config/_auth')

const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')

const should = chai.should()
const { User } = db

describe('#1 admin restaurants', () => {
  it('未登入狀態 GET /admin/restaurants/create', (done) => {
    request(app)
      .get('/admin/restaurants/create')
      .end((err, res) => {
        res.statusCode.should.be.equal(302)
        done()
      })
  })
})

describe('#1 admin restaurants', () => {
  before(() => {
    User.destroy({ where: {}, truncate: true })
    this.authenticate = sinon.stub(auth, 'isAuthenticated').returns(true)
    this.admin = sinon.stub(auth, 'isUserAdmin').returns(false)
  })

  it('登入狀態但無 admin 權限 GET /admin/restaurants/create', (done) => {
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

describe('#1 admin restaurants', () => {

  before(() => {
    User.destroy({ where: {}, truncate: true })

    this.authenticate = sinon.stub(auth, 'isAuthenticated').returns(true)
    this.admin = sinon.stub(auth, 'isUserAdmin').returns(true)
  })

  it('登入狀態且有 admin 權限 GET /admin/restaurants/create', (done) => {
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
