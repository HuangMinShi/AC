const express = require('express')
const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const userController = require('../controllers/api/userController')
const restController = require('../controllers/api/restController')

// middleware
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  const results = {
    status: 'failure',
    message: 'permission denied'
  }

  if (req.user) {
    if (req.user.isAdmin) return next()
    return res.json(results)
  }
  return res.json(results)
}



// admin/restaurants
router.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

// admin/users
router.put('/admin/users/:id', adminController.putUser)

// admin/categories
router.get('/admin/categories', categoryController.getCategories)
router.get('/admin/categories/:id', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategories)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

// signin signup
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

// restaurants
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)










module.exports = router
