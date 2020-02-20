module.exports = {

  //  生成月份
  genMonths: () => {
    const months = []

    for (let i = 0; i < 13; i++) {
      months.push(`${i}月`)
    }

    return months
  },
  // 生成年分
  genYearsFrom: (start) => {
    const years = []
    const end = new Date().getFullYear()

    if (!start) start = 2010

    for (start; start <= end; start++) {
      years.push(start)
    }

    return years
  }
}