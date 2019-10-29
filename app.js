const express = require('express')

const db = require('./models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const port = process.env.PORT || 3000
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: 'swedtuj', resave: false, saveUninitialized: true }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})


app.listen(port, () => {
  db.sequelize.sync()
  console.log(`App is running on localhost:${port}`)
})

require('./routes')(app, passport)