const db = require('../../models')
const adminService = require('../../services/adminService')

const { Restaurant, Category } = db

const adminController = {
  getRestaurants: (req, res) => {
    return adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = adminController








