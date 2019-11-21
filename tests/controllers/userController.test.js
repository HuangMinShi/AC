const db = require('../../models')
const app = require('../../app')

const chai = require('chai')
const request = require('supertest')

const should = chai.should()
const { User } = db

describe('#1 signup', () => {

  it('GET /signup', (done) => {
    request(app)
      .get('/signup')
      .end((err, res) => {
        res.statusCode.should.be.equal(200)
        res.text.should.be.contains('Sign Up')
        done()
      })
  })

})