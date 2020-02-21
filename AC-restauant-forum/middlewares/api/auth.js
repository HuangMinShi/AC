const passport = require('../../config/passport')

function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ status: 'failure', message: '沒有auth token' })
    }

    req.user = user
    return next()
  })(req, res, next)
}

function authenticatedAdmin(req, res, next) {
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

module.exports = {
  authenticated,
  authenticatedAdmin
}