const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1/record')
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoose error!')
})
db.once('open', () => {
  console.log('mongoose connected!')
})

app.get('/', (req, res) => {
  res.send('1')
})

app.listen(port, () => {
  console.log(`The server is running on localhost://${port}`)
})