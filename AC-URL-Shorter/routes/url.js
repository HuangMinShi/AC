const express = require('express')
const router = express.Router()
const Url = require('../models/url')
const { genHash, genUniqueKeyIn } = require('../libs/generate')
const { checkUrl } = require('../auths/validity')

// 首頁
router.get('/', (req, res) => {
  res.render('index')
})

// 新增url 利用checkUrl middleware檢查url
router.post('/', checkUrl, (req, res) => {
  const baseUrl = 'localhost:3000'
  const url = req.body.url
  const urlId = genHash(url)

  // 利用hash後的Id搜尋以增加效率
  Url
    .find({ urlId })
    .then(hasUrls => {

      // 是否有重複url?
      if (hasUrls.length) {

        const result = hasUrls.find(item => {
          return item.url === url
        })

        // 有，回傳短網址的key
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

      // 生成唯一key
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

// 瀏覽shortenUrl
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