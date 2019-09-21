const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { date } = require('../libs/comFunc')

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: date(),
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)