const express = require('express')
const router = express.Router()
const Url = require('../models/url')
const { genHash, genUniqueKeyIn } = require('../libs/generate')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {
  const url = req.body.url
  const urlId = genHash(url)

  Url
    .find({ urlId })
    .then(urls => {

      if (urls.length) {

        const result = urls.find(item => {
          return item.url === url
        })

        if (result) {
          return result.key
        }
      }

      return ''
    })
    .then(key => {
      if (key) {
        return res.render('index', { key })
      }

      return genUniqueKeyIn(Url, 5)
    })
    .then(keyPair => {

      if (keyPair) {
        const { key, keyId } = keyPair
        Url.create({ key, url, keyId, urlId })

        return res.render('index', { key })
      }

    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/:key', (req, res) => {
  const key = req.params.key
  const keyId = genHash(key)

  Url
    .findOne({ keyId })
    .then(key => {
      if (key) {
        return res.redirect(key.url)
      }
      const keyError = true
      return res.render('index', { keyError })
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router