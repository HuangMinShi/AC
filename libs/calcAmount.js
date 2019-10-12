module.exports = {

  //  加總
  sum: (arr) => {
    const amountList = arr.map(item => item.amount)
    return amountList.length ? amountList.reduce((p, c) => p + c) : 0
  }

}
