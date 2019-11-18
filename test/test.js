const assert = require('assert')

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
