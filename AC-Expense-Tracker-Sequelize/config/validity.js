const categoryList = require('../public/categoryList.json')

module.exports = {

  checkRecordInput: (req, res, next) => {

    const record = { ...req.body }
    const errors = []

    // item 空白 或 類別沒選
    if (!record.item.trim() || record.category === '請選擇類別') {
      errors.push({ message: '請填入支出項目或選擇項目類別' })
    }

    // amount 非數字
    const pattern = /^[1-9]+\d*$/
    const amount = Number(record.amount.replace(/[' ','　']/g, ''))

    if (!pattern.test(amount)) {
      errors.push({ message: '請填入正確金額格式（e.g. 100, 50）' })
    }

    if (errors.length > 0) {

      let page = 'new'
      const variables = {
        record,
        categoryList,
        category2Cn: categoryList[record.category],
        errors
      }

      // 判斷是否為修改單筆支出
      if (req.params.id) {
        record.id = req.params.id
        page = 'edit'
      }

      return res.render(page, variables)
    }

    next()

  },

  checkEmailInput: (req, res, next) => {

    const { name, email, password, password2 } = req.body
    const errors = []
    const pattern = /^\w+([\.-]?\w)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!name || !email || !password || !password2) {
      errors.push({ message: '必填欄位不得為空!' })
    }

    if (password !== password2) {
      errors.push({ message: '密碼輸入錯誤，請重新輸入!' })
    }

    if (!pattern.test(email)) {
      errors.push({ message: '請填入正確信箱格式（e.g. example@gmail.com）' })
    }

    if (errors.length > 0) {

      const variables = {
        name,
        email,
        password,
        password2,
        errors
      }

      return res.render('register', variables)
    }

    next()

  }
}