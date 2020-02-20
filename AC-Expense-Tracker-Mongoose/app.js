//  引入module
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

//  判斷環境設定
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//  宣告相關變數
const app = express()
const port = 3000

//  連接mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/record', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoose error!')
})
db.once('open', () => {
  console.log('mongoose connected!')
})

//  自訂義helpers
const hbs = exphbs.create({
  helpers: {
    is: function (str1, str2, options) {
      if (str1 === str2) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    }
  },
  defaultLayout: 'main'
})

//  設置template engine
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({
  secret: 'Black Hawk Down',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

//  路由
app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

//  監聽
app.listen(process.env.PORT || port, () => {
  console.log(`The server is running on localhost://${port}`)
})