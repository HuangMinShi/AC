const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Record = require('./models/record')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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
app.use(methodOverride('_method'))

let filterCategory = ''
//首頁
app.get('/', (req, res) => {
  filterCategory = ''
  Record.find()
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)

      const amountList = records.map(item => Number(item.amount))
      let totalAmount = 0
      if (amountList.length) {
        totalAmount = amountList.reduce((p, c) => p + c)
      }

      return res.render('index', { records, totalAmount })
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
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    return res.render('edit', { record })
  })
})
//編輯1筆
app.put('/records/:id/edit', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    Object.assign(record, req.body)
    record.save(err => {
      if (err) return console.log(err)
      if (filterCategory) {
        return res.redirect(`/records/filter?category=${filterCategory}`)
      } else {
        return res.redirect('/')
      }
    })
  })
})
//刪除1筆
app.delete('/records/:id/delete', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    return record.remove(err => {
      if (err) return console.log(err)
      if (filterCategory) {
        return res.redirect(`/records/filter?category=${filterCategory}`)
      } else {
        return res.redirect('/')
      }
    })
  })
})
//篩選類別
app.get('/records/filter', (req, res) => {
  filterCategory = req.query.category
  Record.find({ category: filterCategory })
    .sort({ date: 'desc' })
    .exec((err, records) => {
      if (err) return console.log(err)

      const amountList = records.map(item => Number(item.amount))
      let totalAmount = 0
      if (amountList.length) {
        totalAmount = amountList.reduce((p, c) => p + c)
      }

      return res.render('index', { records, totalAmount, filterCategory })
    })
})

app.listen(port, () => {
  console.log(`The server is running on localhost://${port}`)
})