const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Url = require('./models/url')
const { genRandomKeyFor, genHash } = require('./libs/genRandomIndex')

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
  const urlIndex = genHash(url)

  Url
    .find({ urlIndex })
    .then(arr => {

      if (arr.length) {

        const result = arr.find(item => {
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

      return query(Url)
    })
    .then(obj => {
      if (!obj) return
      const { key, keyIndex } = obj
      Url.create({ url, urlIndex, key, keyIndex })
      res.render('index', { key })
    })
    .catch(err => {
      console.log(err);
    })
})

app.get('/:key', (req, res) => {
  const key = req.params.key

  const keyIndex = genHash(key)

  Url
    .findOne({ keyIndex })
    .then(result => {
      if (result) {
        return res.redirect(result.url)
      }
      throw err
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})




app.listen(port, () => {
  return console.log(`The server is running on localhost:${port}`)
})

function query(Model) {
  const key = genRandomKeyFor(5)
  const keyIndex = genHash(key)

  return Model
    .find({ keyIndex })
    .then(arr => {

      if (arr.length) {

        const result = arr.find(item => {
          return item.key === key
        })

        if (result) {
          return query(Model)
        }
      }

      return { key, keyIndex }
    })
    .catch(err => {
      return console.log(err)
    })
}