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
app.use('/', require('./routes/home'))
app.use('/users', require('./routes/user'))

app.listen(port, () => {
  console.log(`Server is running on https://127.0.0.1:${port}`)
})