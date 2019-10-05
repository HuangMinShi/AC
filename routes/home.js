const express = require('express')
const router = express.Router()

// 首頁
router.get('/', (req, res) => {
  res.send('Hello world!')
})

module.exports = router