//  引入類別清單.json
const categoryList = require('../categoryList.json')

module.exports = {

  //  驗證新增一筆支出的表單
  checkRecord: (req, res, next) => {
    const { name, category, amount, date: day } = req.body
    let errors = []

    //  檢查名稱及類別
    if (!name.trim() || category === '選擇類別') {
      errors.push({ message: '請填入支出項目並選擇類別' })
    }

    //  檢查金額
    const pattern = /^[1-9]+\d*$/
    amountValue = Number(amount.replace(/[' ','　']/g, ''))

    if (!pattern.test(amountValue)) {
      errors.push({ message: '請輸入正確金額格式(例如:100、50)' })
    }

    //  有錯誤訊息=>渲染頁面包含錯誤訊息
    if (errors.length > 0) {
      const recordCategory = categoryList[category]
      res.render('new', { name, day, amount, categoryList, recordCategory, errors })
    } else {
      req.body.amount = amountValue
      return next()
    }
  },

  //  驗證使用者註冊的表單
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