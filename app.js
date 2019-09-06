// include module and package
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')

// define server related variables
const app = express()
const port = 3000

// set engine template
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static data path and use bodyparser to encode URL
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// connect to mongodb and get the object
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })
const db = mongoose.connection

// start listening on db event
db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// add routes
// ///////////////////// 首頁//
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants })
  })
})
// ///////////////////// 瀏覽全部餐廳
app.get('/restaurants', (req, res) => {
  res.redirect('/')
})
// ///////////////////// 新增一筆餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
// ///////////////////// 查看一筆餐廳
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('show', { restaurant })
  })
})
// ///////////////////// 新增一筆餐廳
app.post('/restaurants', (req, res) => {
  const restaurant = new Restaurant({})
  Object.assign(restaurant, req.body)
  restaurant.save((err) => {
    if (err) return console.log(err)
    return res.redirect('/')
  })
})
// ///////////////////// 修改一筆餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('edit', { restaurant })
  })
})
// ///////////////////// 修改一筆餐廳
app.post('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    Object.assign(restaurant, req.body)
    restaurant.save(err => {
      if (err) return console.log(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})
// ///////////////////// 刪除一筆餐廳
app.post('/restaurant/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    restaurant.remove(err => {
      if (err) return console.log(err)
      return res.redirect('/')
    })

  })
})
//start listening on server
app.listen(port, () => {
  console.log(`The server is running on localhost:${port}`)
})