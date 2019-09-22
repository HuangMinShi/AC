const mongoose = require('mongoose')
const Record = require('../record')
const User = require('../user')
const bcrypt = require('bcryptjs')
const { date, getRandomOf } = require('../../libs/comFunc')

const categoryExample = {
  home: ['爆裂魔杖', '速度之靴', '巨人腰帶', '靈巧披風', '長劍', '反曲弓'],
  "shuttle-van": ['泡溫泉', '閃現', '傳送', '中離'],
  "grin-beam": ['拆塔', '吃龍'],
  utensils: ['生命藥水', '回復藥水', '污濁藥劑', '抗擊藥劑'],
  pen: ['冒險者守衛', '控域守衛', '藍水晶', '紅水晶']
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/record', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error!')
})

db.once('open', () => {
  console.log('mongoose connected!')

  //  產生2位使用者
  for (let i = 1; i <= 2; i++) {
    const user = new User({
      name: `user${i}`,
      email: `user${i}@example.com`,
      password: '12345'
    })

    //  密碼加鹽
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err
        user.password = hash

        user
          .save()
          .then()
          .catch(err => {
            console.log(err)
          })
      })
    })

    //  隨機生成8筆支出項目
    for (let i = 0; i < 8; i++) {
      const keys = Object.keys(categoryExample)
      const categoryItem = getRandomOf(keys)
      const categoryName = getRandomOf(categoryExample[categoryItem])

      Record.create({
        name: categoryName,
        date: date(),
        category: categoryItem,
        amount: Math.floor(Math.random() * 100),
        userId: user._id
      })
    }
  }

  console.log('done')
})
