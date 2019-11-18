const assert = require('assert')

function sum(a, b) {
  return a + b
}

// #1 測試檔案內函式
describe('Sum', function () {
  it('sum(1,2) === 3 ?', function () {
    assert.equal(sum(1, 2), 3)
  })
})
