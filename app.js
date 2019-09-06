// include module and package
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

// set variables related server
const app = express()
const port = 3000

// set engine template
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static data path
app.use(express.static('public'))

// set routes
app.get('/', (req, res) => {
  res.render('index')
})

//start listening on server
app.listen(port, () => {
  console.log(`The server is running on localhost:${port}`)
})



















