//  共同使用函式
module.exports = {
  dateDiff: (date1, date2) => {
    const d1 = date1.split('-')
    const d2 = date2.split('-')
    const dt1 = new Date(d1[0], d1[1], d1[2])
    const dt2 = new Date(d2[0], d2[1], d2[2])
    return parseInt((dt2 - dt1) / (1000 * 60 * 60 * 24))
  }
}