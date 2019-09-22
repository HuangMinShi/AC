const categoryList = require('../categoryList.json')

module.exports = {
  checkRecord: (req, res, next) => {
    const { name, category, amount, date: day } = req.body
    let errors = []
    const pattern = /^[1-9]+\d*$/

    if (!name.trim() || category === '選擇類別') {
      errors.push({ message: '請填入支出項目並選擇類別' })
    }

    amountValue = Number(amount.replace(/[' ','　']/g, ''))

    if (!pattern.test(amountValue)) {
      errors.push({ message: '請輸入正確金額格式(例如:100、50)' })
    }

    if (errors.length > 0) {
      const recordCategory = categoryList[category]
      res.render('new', { name, day, amount, categoryList, recordCategory, errors })
    } else {
      req.body.amount = amountValue
      return next()
    }
  },
  checkEmail: (req, res, next) => {
    const { name, email, password, password2 } = req.body
    let errors = []
    const pattern = /^\w+([\.-]?\w)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/


    emailValue = email.trim()

    if (!pattern.test(emailValue)) {
      errors.push({ message: '請輸入正確信箱格式(例如:example@hotmail.com)' })
    }

    if (errors.length > 0) {
      res.render('register', { name, email, errors })
    } else {
      req.body.email = emailValue
      return next()
    }
  }
}