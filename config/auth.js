const auth = require('./_auth')

const authenticated = (req, res, next) => {
  if (auth.isAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (auth.isAuthenticated(req)) {
    if (auth.isUserAdmin(req)) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}