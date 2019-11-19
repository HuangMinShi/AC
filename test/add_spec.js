const should = chai.should()
const err = 'something wrong!!'

// #8 測試函式 - chai & show test_report
describe('#8 測試函式 - chai', () => {

  it('整數相加回傳結果', () => {
    add(1, 2).should.be.equal(3)
  })

  it('輸入字串', () => {
    add('1', '2').should.be.equal(err)
  })

  it('輸入為 0', () => {
    add(4, 0).should.be.equal(err)
  })

  it('輸入為負數', () => {
    add(6, -5).should.be.equal(err)
  })

  it('輸入過大的數', () => {
    add(Number.MAX_SAFE_INTEGER, 1).should.be.equal(err)
  })
})