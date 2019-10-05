module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) next()
    res.redirect('/users/login')
  }
}