const should = chai.should()

describe('Test FizzBuzz function', () => {

  it('[case 1] input: 6, expect output: Fizz, bcz divided by 3', () => {
    const expect = 'Fizz'
    const result = fizzBuzz(6)

    result.should.be.equal(expect)
  })

  it('[case 2] input: 10, expect output: Buzz, bcz divided by 5', () => {
    const expect = 'Buzz'
    const result = fizzBuzz(10)

    result.should.be.equal(expect)
  })

  it('[case 3] input: 30, expect output: FizzBuzz, bcz divided by 3 and 5', () => {
    const expect = 'FizzBuzz'
    const result = fizzBuzz(30)

    result.should.be.equal(expect)
  })

  it('[case 4] input: 2, expect output: 2, bcz not divided by 3 and 5', () => {
    const expect = 2
    const result = fizzBuzz(2)

    result.should.be.equal(expect)
  })
})