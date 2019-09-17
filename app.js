const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1/record', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoose error!')
})
db.once('open', () => {
  console.log('mongoose connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//首頁
app.get('/', (req, res) => {
  res.render('index')
})
//列出全部
app.get('/records', (req, res) => {
  res.send('2')
})
//新增1筆頁面
app.get('/records/new', (req, res) => {
  res.send('3')
})
//新增1筆
app.post('/records', (req, res) => {
  res.send('4')
})
//編輯1筆頁面
app.get('/records/:id/edit', (req, res) => {
  res.send('5')
})
//編輯1筆
app.post('/records/:id/edit', (req, res) => {
  res.send('6')
})
//刪除1筆
app.post('/records/:id/delete', (req, res) => {
  res.send('7')
})

app.listen(port, () => {
  console.log(`The server is running on localhost://${port}`)
})