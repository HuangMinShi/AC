
module.exports = {
  // 隨機產生5位英數字字串
  genRandomKeyFor = (digits) => {
    const symbol = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let key = ''

    for (let i = 0; i < digits; i++) {
      key += symbol.charAt(Math.floor(Math.random() * symbol.length))
    }

    return key
  },

  // 產生hash當作索引
  genHash = (key) => {
    let hash = 1

    if (key.length === 5) {
      for (let i = 0; i < key.length; i++) {
        hash *= key.charCodeAt(i)
      }
    } else {
      for (let i = 0; i < key.length; i++) {
        hash += key.charCodeAt(i)
      }
    }

    return (hash + 127) % 1019
  }
}