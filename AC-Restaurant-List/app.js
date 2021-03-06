// ============ basic settings ============ //
// include module and package
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// define server related variables
const app = express()
const port = 3000

// set engine template
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static data path and use bodyparser to encode URL
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// override with POST having ?_method=PUT/DELETE
app.use(methodOverride('_method'))

// connect to mongodb and get the object
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

// start listening on db event
db.on('error', () => console.log('mongodb error!'))
db.once('open', () => console.log('mongodb connected!'))

// session
app.use(session({
  secret: 'qwertyuiop',
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
  next()
})





// ============ routes ============ //
// use route-prefix and include router
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/search', require('./routes/search'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))


// ============ start listening on server ============ //
//start listening on server
app.listen(port, () => {
  console.log(`The server is running on localhost:${port}`)
})