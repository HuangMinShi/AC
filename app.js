const express = require('express')
const exphbs = require('express-handlebars')
const methodOveride = require('method-override')
const app = express()

const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(methodOveride('_method'))
app.use((req, res, next) => {
  // 取得req進入時間點的date_object
  const date = new Date()

  const options = {
    timeZone: 'Asia/Taipei',
    hour12: false
  }
  const timeStamps = date.toLocaleString('zh-TW', options)
  const results = `${timeStamps} | ${req.method} from ${req.url}`
  console.log(results)

  next()
})

// 列出全部 Todo
app.get('/', (req, res) => {
  res.render('index')
  // res.send('列出全部 Todo')
})

// 新增一筆 Todo 頁面
app.get('/new', (req, res) => {
  res.send('新增 Todo 頁面')
})

// 顯示一筆 Todo 的詳細內容
app.get('/:id', (req, res) => {
  res.send('顯示一筆 Todo')
})

// 新增一筆  Todo
app.post('/', (req, res) => {
  res.send('新增一筆  Todo')
})

app.delete('/:id/delete', (req, res) => {
  res.send('刪除 Todo')
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})