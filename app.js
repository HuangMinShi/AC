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
// 首頁
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants })
  })
})

// 瀏覽全部餐廳
app.get('/restaurants', (req, res) => {
  res.redirect('/')
})

// 新增一筆餐廳頁面
app.get('/restaurants/new', (req, res) => {
  const createNew = true
  res.render('new_or_edit', { createNew })
})

// 查看一筆餐廳
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('show', { restaurant })
  })
})

// 新增一筆餐廳
app.post('/restaurants', (req, res) => {
  const restaurant = new Restaurant({})
  Object.assign(restaurant, req.body)

  // 預設圖片
  if (!restaurant.image) {
    restaurant.image = '/images/default.png'
  }

  restaurant.save((err) => {
    if (err) return console.log(err)
    return res.redirect('/')
  })
})

// 修改一筆餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('new_or_edit', { restaurant })
  })
})

// 修改一筆餐廳
app.put('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)

    Object.assign(restaurant, req.body)

    restaurant.save(err => {
      if (err) return console.log(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// 刪除一筆餐廳
app.delete('/restaurant/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    restaurant.remove(err => {
      if (err) return console.log(err)
      return res.redirect('/')
    })

  })
})

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