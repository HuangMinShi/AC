const isAuthenticated = (req) => {
  return req.isAuthenticated()
}

const isUserAdmin = (req) => {
  return req.user.isAdmin
}

module.exports = {
  isAuthenticated,
  isUserAdmin
}