module.exports = {
  addUp: (arr) => {
    const amountList = arr.map(item => Number(item.amount))
    return amountList.length ? amountList.reduce((p, c) => p + c) : 0
  }
}