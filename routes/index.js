const restController = require('../controllers/restController')

module.exports = app => {

  // 首頁導向 /restaurants page
  app.get('/', (req, res) => res.redirect('/restaurants'))

  // 在/restaurants restController.getRestaurants 處理
  app.get('/restaurants', restController.getRestaurants)

}