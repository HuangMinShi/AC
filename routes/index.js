const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // restaurants
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)
  app.get('/restaurants/:id', restController.getRestaurant)

  // comments 
  app.post('/comments', commentController.postComment)
  app.delete('/comments/:id', commentController.deleteComment)

  // admin
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)
  app.get('/admin/restaurants/create', adminController.createRestaurant)
  app.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', adminController.editRestaurant)
  app.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/resturants/:id', adminController.deleteRestaurant)

  app.get('/admin/users', adminController.editUsers)
  app.put('/admin/users/:id', adminController.putUser)

  // categories
  app.get('/admin/categories', categoryController.getCategories)
  app.post('/admin/categories', categoryController.postCategories)
  app.get('/admin/categories/:id', categoryController.getCategories)
  app.put('/admin/categories/:id', categoryController.putCategory)
  app.delete('/admin/categories/:id', categoryController.deleteCategory)

  // login, register and logout
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local',
    {
      failureRedirect: '/signin',
      failureFlash: true
    }), userController.signIn)
  app.get('/logout', userController.logout)
}