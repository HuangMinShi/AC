module.exports = {

  //  生成月份
  genMonths: () => {
    const months = []

    for (let i = 0; i < 13; i++) {
      months.push(`${i}月`)
    }

    return months
  }

}