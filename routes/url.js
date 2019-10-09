const express = require('express')
const router = express.Router()
const Url = require('../models/url')
const { genHash, genUniqueKeyIn } = require('../libs/generate')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {
  const baseUrl = req.headers.host
  const url = req.body.url
  const urlId = genHash(url)

  Url
    .find({ urlId })
    .then(hasUrls => {

      if (hasUrls.length) {

        const result = hasUrls.find(item => {
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
        const shortenUrl = `${baseUrl}/${key}`
        return res.render('index', { key, shortenUrl })
      }

      return genUniqueKeyIn(Url, 5)

    })
    .then(keyPair => {

      if (keyPair) {
        const { key, keyId } = keyPair
        const shortenUrl = `${baseUrl}/${key}`

        Url.create({ key, url, keyId, urlId })

        return res.render('index', { key, shortenUrl })

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
    .then(hasKey => {

      if (hasKey) {
        return res.redirect(hasKey.url)
      }

      const keyError = true
      const shortenUrl = `${req.headers.host}/${key}`

      return res.render('index', { keyError, shortenUrl })

    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router