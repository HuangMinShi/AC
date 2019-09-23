//  共同使用的函式
module.exports = {

  //  加總
  addUp: (arr) => {
    const amountList = arr.map(item => Number(item.amount))
    return amountList.length ? amountList.reduce((p, c) => p + c) : 0
  },

  //  取得當日日期並符合格式
  getFormatDate: (date) => {
    return formatDate = date.toJSON().split('T')[0]
  },

  //  標註支出清單中偶數序列=>為主頁偶數筆支出穿插底色
  markEvenOrderList: (arr) => {
    arr.forEach((item, index) => {
      if (index % 2 === 0) {
        item.isEvenOrder = true
      }
    })
  },

  //  隨機取得陣列元素
  getRandomOf(arr) {
    let index = Math.floor(Math.random() * arr.length)
    return arr[index]
  },

  //  篩選arr當中m月份支出項目
  filterMonth(arr, m) {
    const arrFilter = arr.filter(item => {
      const date = new Date(item.date)
      const month = date.getMonth() + 1
      return month === Number(m) ? item : false
    })
    return arrFilter
  }
}