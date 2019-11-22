const isAuthenticated = (req) => {
  return req.isAuthenticated()
}

const isUserAdmin = (req) => {
  return req.user.idAdmin
}

module.exports = {
  isAuthenticated,
  isUserAdmin
}