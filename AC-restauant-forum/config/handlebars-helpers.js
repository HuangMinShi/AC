const moment = require('moment')


module.exports = {
  // recommend to use function keyword to define helper function 
  ifCond: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: (a) => {
    return moment(a).fromNow()
  }
}