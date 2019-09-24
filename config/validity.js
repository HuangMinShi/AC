const categoryList = require('../categoryList.json')

module.exports = {

  //  驗證新增支出表單
  checkRecord: (req, res, next) => {
    //  原路由從資料庫尋找單筆record，template渲染的是record的屬性值，這裡仿造 
    const record = { ...req.body }
    let errors = []

    //  檢查名稱及類別
    if (!record.name.trim() || record.category === '選擇類別') {
      errors.push({ message: '請填入支出項目並選擇類別' })
    }

    //  檢查金額
    const pattern = /^[1-9]+\d*$/
    amountValue = Number(record.amount.replace(/[' ','　']/g, ''))

    if (!pattern.test(amountValue)) {
      errors.push({ message: '請輸入正確金額格式(例如:100、50)' })
    }

    if (errors.length > 0) {
      let page = 'new'
      if (req.params.id) {
        record.id = req.params.id
        record.dateFormat = record.date
        page = 'edit'
      }

      const options = {
        record,
        //  new template 需要
        date: record.date,
        categoryList,
        category2Cn: categoryList[record.category],
        errors
      }

      res.render(page, options)
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