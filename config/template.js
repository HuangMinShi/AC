const exphbs = require('express-handlebars')

const instanceOfExphbs = exphbs.create({
  helpers: {
    is: (str1, str2, options) => {
      if (str1 === str2) return options.fn(this)
      return options.inverse(this)
    }
  },
  defaultLayout: 'main'
})

module.exports = instanceOfExphbs
