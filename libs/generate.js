const genKey = (digits) => {
  const symbol = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let key = ''

  for (let i = 0; i < digits; i++) {
    key += symbol.charAt(Math.floor(Math.random() * symbol.length))
  }

  return key
}

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