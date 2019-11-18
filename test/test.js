const assert = require('assert')
const helper = require('../helper')
const axios = require('axios')

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
*/

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