const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/add', (req, res) => {
  const sum = Number(req.query.a) + Number(req.query.b)
  return res.send(`${sum}`)
})

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
})

module.exports = app