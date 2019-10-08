const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  keyIndex: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  urlIndex: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Url', urlSchema)