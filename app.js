// ============ basic settings ============ //
// include module and package
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override')

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
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })
const db = mongoose.connection

// start listening on db event
db.on('error', () => console.log('mongodb error!'))
db.once('open', () => console.log('mongodb connected!'))





// ============ routes ============ //
// use route-prefix and include router
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))

// 搜尋餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const regExp = new RegExp(keyword, 'i')

  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)

    let matchRestaurants = restaurants.filter(item => {
      return (item.name.match(regExp) || item.category.match(regExp))
    })

    res.render('index', { restaurants: matchRestaurants, keyword })
  })
})





// ============ start listening on server ============ //
//start listening on server
app.listen(port, () => {
  console.log(`The server is running on localhost:${port}`)
})