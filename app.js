const express = require('express')

const db = require('./models')
const exphbs = require('express-handlebars')

const port = 3000
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`App is running on localhost:${port}`)
})

require('./routes')(app)