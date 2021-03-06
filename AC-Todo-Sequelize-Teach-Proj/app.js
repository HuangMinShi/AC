const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const dotenv = require('dotenv')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models')
const Todo = db.Todo
const User = db.User

const port = 3000

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

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'wertyuidf',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

require('./config/passport')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

// routes
app.use('/', require('./routes/home'))
app.use('/users', require('./routes/user'))
app.use('/todos', require('./routes/todo'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`Server is running on https://127.0.0.1:${port}`)
})