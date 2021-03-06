const express = require('express')

const exphbs = require('./config/template')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
require('./config/passport')(passport)

const app = express()
const port = 3000

// all environments
app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'save the world', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

app.listen(port, () => {
  console.log(`Server is running on localhost://${port}`)
})