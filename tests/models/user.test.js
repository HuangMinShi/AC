const db = require('../../models')
const { User } = db

const chai = require('chai')
const should = chai.should()

describe('#1 User Model', () => {
  describe('CRUD', () => {

    let data = null

    it('# Create', (done) => {
      User
        .create()
        .then(user => {
          data = user
          done()
        })
        .catch(err => console.log(err))
    })

    it('# Read', (done) => {
      User
        .findByPk(data.id)
        .then(user => {
          data.id.should.be.equal(user.id)
          done()
        })
        .catch(err => console.log(err))
    })

    it('# Update', (done) => {
      User
        .update({}, { where: { id: data.id } })
        .then(() => User.findByPk(data.id))
        .then(user => {
          data.updatedAt.should.be.not.equal(user.updatedAt)
          done()
        })
        .catch(err => console.log(err))
    })

    it('# Delete', (done) => {
      User
        .destroy({ where: { id: data.id } })
        .then(() => User.findByPk(data.id))
        .then(user => {
          should.equal(user, null)
          done()
        })
        .catch(err => console.log(err))
    })
  })
})