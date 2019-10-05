const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// routes
// 首頁
app.get('/', (req, res) => {
  res.send('Hello world!')
})
// 註冊
app.get('/users/register', (req, res) => {
  res.render('register')
})
// 註冊提交
app.post('/users/register', (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(user => {
    res.redirect('/')
  })
})
// 登入
app.get('/users/login', (req, res) => {
  res.render('login')
})
// 登入提交
app.post('/users/login', (req, res) => {
  res.send('login')
})
// 登出
app.get('/users/logout', (req, res) => {
  res.redirect('/users/login')
})

app.listen(port, () => {
  console.log(`Server is running on https://127.0.0.1:${port}`)
})