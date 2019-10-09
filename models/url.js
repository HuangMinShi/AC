const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  keyId: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  urlId: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
})

urlSchema.index({ keyId: 1, urlId: 1 })
module.exports = mongoose.model('Url', urlSchema)