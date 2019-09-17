const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Record = require('./models/record')
const bodyParser = require('body-parser')

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
app.use(bodyParser.urlencoded({ extended: true }))

//首頁
app.get('/', (req, res) => {
  Record.find((err, records) => {
    if (err) return console.log(err)
    return res.render('index', { records })
  })
})
//列出全部
app.get('/records', (req, res) => {
  res.redirect('/')
})
//新增1筆頁面
app.get('/records/new', (req, res) => {
  res.render('new')
})
//新增1筆
app.post('/records', (req, res) => {
  const newRecord = new Record(req.body)

  newRecord.save(err => {
    if (err) return console.log(err)
    return res.redirect('/records')
  })
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