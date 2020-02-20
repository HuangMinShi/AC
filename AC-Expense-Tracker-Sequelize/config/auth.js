module.exports = {
  authenticated: (req, res, next) => {

    if (!req.isAuthenticated()) {
      req.flash('warning_msg', '請先登入後使用')
      return res.redirect('/users/login')
    }

    next()
  }
}