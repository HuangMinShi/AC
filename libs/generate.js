// 隨機生成英數字混合字串當key
const genKey = (digits) => {
  const symbol = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let key = ''

  for (let i = 0; i < digits; i++) {
    key += symbol.charAt(Math.floor(Math.random() * symbol.length))
  }

  return key
}

// 生成hash當索引
const genHash = (key) => {
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

// 生成key後與資料庫比對是否重複
const genUniqueKeyIn = (Model, digits) => {
  const key = genKey(digits)
  const keyId = genHash(key)

  return compareKeyTo(Model)

  function compareKeyTo(Model) {
    return Model
      .find({ keyId })
      .then(keys => {

        if (keys.length) {

          const result = keys.find(item => {
            return item.key === key
          })

          // 重複則持續產生key
          if (result) {
            return genUniqueKeyIn(Model, digits)
          }
        }

        return { key, keyId }
      })
      .catch(err => {
        return console.log(err)
      })
  }
}

module.exports = {
  genHash,
  genUniqueKeyIn
}