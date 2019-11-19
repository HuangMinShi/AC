const assert = require('assert')
const axios = require('axios')
const sinon = require('sinon')

const helpers = require('../helpers')
const request = require('supertest')
const app = require('../app')

/**
function sum(a, b) {
  return a + b
}

// #1 測試檔案內函式
describe('#1 測試檔案內函式', function () {
  it('sum(1,2) === 3 ?', function () {
    assert.equal(sum(1, 2), 3)
  })
})

// #2 測試檔案外函式
describe('#2 測試檔案外函式', function () {
  it('sum(1,2) === 3 ?', function () {
    assert.equal(helper.sum(1, 2), 3)
  })
})

// #3 測試路由 - axios(開啟伺服器)
describe('#3 測試路由 - axios', () => {
  it('sum(1,2) === 3 ?', (done) => {
    axios
      .get('http://localhost:3000/add?a=1&b=2')
      .then(res => {
        return res.data
      })
      .then(data => {
        assert.equal(data, 3)
        return done()
      })
      .catch(err => {
        console.log(err)
      })
  })
})


// #4 測試路由 - supertest
describe('#4 測試路由 - supertest', () => {
  it('sum(1,2) === 3 ?', (done) => {
    request(app)
      .get('/add?a=1&b=2')
      .end((err, res) => {
        if (err) return done(err)

        assert.equal(res.text, 3)
        return done()
      })
  })
})

// #5 模擬登入 - stub
describe('#5 模擬登入 - stub', () => {

  before(() => {
    sinon
      .stub(helpers, 'logined')
      .returns(true)
  })

  it('sum(1,2) === 3 ?', (done) => {
    request(app)
      .get('/add?a=1&b=2')
      .end((err, res) => {
        if (err) return done(err)

        assert.equal(res.text, 3)
        return done()
      })
  })

  after(() => {
    helpers.logined.restore()
  })
})
*/

// #6 模擬登入 - mock
describe('#6 模擬登入 - mock', () => {

  before(() => {
    sinon
      .mock(helpers)
      .expects('logined')
      .once()
      .returns(true)
  })

  it('sum(1,2) === 3 ?', (done) => {
    request(app)
      .get('/add?a=1&b=2')
      .end((err, res) => {
        if (err) return done(err)

        assert.equal(res.text, 3)
        return done()
      })
  })

  after(() => {
    helpers.logined.restore()
  })
})