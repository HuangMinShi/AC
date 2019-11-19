const express = require('express')

const helper = require('./helper')

const app = express()
const port = 3000
let logined = false

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/add', (req, res) => {

  if (!helper.logined() && !logined) {
    return res.send('')
  }

  const sum = Number(req.query.a) + Number(req.query.b)
  return res.send(`${sum}`)
})

app.get('/login', (req, res) => {
  logined = true
  return res.send('')
})

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
})

module.exports = app