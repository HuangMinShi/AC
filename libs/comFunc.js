module.exports = {
  addUp: (arr) => {
    const amountList = arr.map(item => Number(item.amount))
    return amountList.length ? amountList.reduce((p, c) => p + c) : 0
  },
  date: () => {
    const today = new Date()
    const yyyy = today.getFullYear().toString()
    let mm = (today.getMonth() + 1).toString()
    let dd = today.getDate().toString()

    mm.length < 2 ? mm = `0${mm}` : mm
    dd.length < 2 ? dd = `0${dd}` : dd

    return `${yyyy}-${mm}-${dd}`
  },
  markEvenOrderList: (arr) => {
    arr.forEach((item, index) => {
      if (index % 2 === 0) {
        item.isEvenOrder = true
      }
    })
  },
  getRandomOf(arr) {
    let index = Math.floor(Math.random() * arr.length)
    return arr[index]
  },
  filterMonth(arr, m) {
    const arrFilter = arr.filter(item => {
      const date = new Date(item.date)
      const month = date.getMonth() + 1
      return month === Number(m) ? item : false
    })
    return arrFilter
  }
}