const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// set routes
// 瀏覽全部餐廳
router.get('/', (req, res) => {
  res.redirect('/')
})

// 新增一筆餐廳頁面
router.get('/new', (req, res) => {
  const createNew = true
  res.render('new_or_edit', { createNew })
})

// 查看一筆餐廳
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('show', { restaurant })
  })
})

// 新增一筆餐廳
router.post('/', (req, res) => {
  // 原:產生空物件實例，資料內容利用Object.assign指派
  // 新:產生物件實例當下便把資料內容當參數傳入
  const restaurant = new Restaurant(req.body)

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
router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('new_or_edit', { restaurant })
  })
})

// 修改一筆餐廳
router.put('/:id/edit', (req, res) => {
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
router.delete('/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    restaurant.remove(err => {
      if (err) return console.log(err)
      return res.redirect('/')
    })
  })
})

module.exports = router