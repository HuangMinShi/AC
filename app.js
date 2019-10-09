const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Url = require('./models/url')
const { genHash, genUniqueKeyIn } = require('./libs/generate')

const app = express()
const port = 3000

mongoose.connect('mongodb://127.0.0.1/url', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
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
      if (!keyPair) return new Error('Without keyPair!')

      const { key, keyId } = keyPair
      Url.create({ key, url, keyId, urlId })

      return res.render('index', { key })
    })
    .catch(err => {
      console.log(err);
      return res.status(422).json(err)
    })
})

app.get('/:key', (req, res) => {
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
      return res.status(422).json(err)
    })
})

app.listen(port, () => {
  return console.log(`The server is running on localhost:${port}`)
})

