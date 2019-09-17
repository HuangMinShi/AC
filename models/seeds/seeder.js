const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://127.0.0.1/record', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoose error!')
})
db.once('open', () => {
  console.log('mongoose connected!')

  for (let i = 0; i < 5; i++) {
    Record.create({
      name: 'name_' + i,
      category: 'category_' + i,
      amount: i + 1
    })
  }

  console.log('done')
})