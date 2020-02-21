// Include module or package
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const generateSentence = require('./generate_sentence')

// Define server related variables
const port = 3000
const app = express()

// Define helpers
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


// Define and set view engine, static data and urlencoded
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// Setting route
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const option = req.body.job
  const sentence = generateSentence(option)
  res.render('index', { sentence, option })
})

// Start listening
app.listen(port, () => {
  console.log(`The server is running on http:localhost:${port}`)
})