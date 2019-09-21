const categoryList = require('../categoryList.json')

module.exports = {
  checkNewRecordValidity: (req, res, next) => {
    const { name, category, amount, date: day } = req.body
    const pattern = /^[1-9]+\d*$/
    let amountvalue = Number(amount.replace(/[' ','　']/g, ''))
    let errors = []

    if (!name.trim() || category === '選擇類別') {
      errors.push({ message: '請填入支出項目並選擇類別!' })
    }

    if (!pattern.test(amountvalue)) {
      errors.push({ message: '請輸入正確金額格式(數字e.g. 5894)!' })
    }

    if (errors.length > 0) {
      res.render('new', { name, day, categoryList, amount, errors })
    } else {
      req.body.amount = amountvalue
      return next()
    }
  }
}