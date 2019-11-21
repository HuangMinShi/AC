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
        res.text.should.be.contain('Sign Up')
        done()
      })
  })

})

describe('#2 signup', () => {

  beforeEach(() => {
    User.destroy({ where: {}, truncate: true })
  })

  it('POST /signup', (done) => {
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

  it('POST /signup but password !== passwordCheck', (done) => {
    request(app)
      .post('/signup')
      .send('name=name&email=email&password=a&passwordCheck=b')
      .end((err, res) => {
        res.statusCode.should.be.equal(302)
        res.text.should.be.contain('/signup')
        done()
      })
  })

  it('POST /signup but user has existed', (done) => {
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

