const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('./restaurant.json')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error!')
})

db.once('open', () => {
  console.log('mongoose connected!')

  const itemPerUser = 3
  for (let i = 1; i <= 2; i++) {
    const seedUser = new User({
      email: `user${i}@example.com`,
      password: '12345678'
    })

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err
      bcrypt.hash(seedUser.password, salt, (err, hash) => {
        if (err) throw err
        User.create({
          email: seedUser.email,
          password: hash
        }).then(user => {
          const offset = (i - 1) * itemPerUser
          const userRestaurants = restaurantList.results.slice(offset, offset + itemPerUser)

          userRestaurants.forEach(item => {
            Restaurant.create({
              name: item.name,
              name_en: item.name_en,
              category: item.category,
              image: item.image,
              location: item.location,
              phone: item.phone,
              google_map: item.google_map,
              rating: item.rating,
              description: item.description,
              userId: user._id
            })
          })
        })
      })
    })
  }

  console.log('done')
})
















  // const itemPerUser = 3
  // for (let index = 1; index <= 2; index++) {
  //   bcrypt.genSalt(10, salt => {
  //     bcrypt.hash('12345678', salt, hash => {
  //       User.create({
  //         email: `user${index}@example.com`,
  //         password: hash
  //       }).then(user => {

  //         let offset = (index - 1) * itemPerUser
  //         const userRestaurants = restaurantList.results.slice(offset, offset + itemPerUser)
  //         userRestaurants.forEach(item => {
  //           Restaurant.create({
  //             name: item.name,
  //             name_en: item.name_en,
  //             category: item.category,
  //             image: item.image,
  //             location: item.location,
  //             phone: item.phone,
  //             google_map: item.google_map,
  //             rating: item.rating,
  //             description: item.description,
  //             userId: user._id
  //           })
  //         })
  //       })
  //     })
  //   })
  // }