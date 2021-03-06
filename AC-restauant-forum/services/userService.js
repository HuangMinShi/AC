const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db

const userService = {
  getUser: (req, res, cb) => {
    const userId = Number(req.params.id)

    User
      .findByPk(userId, {
        include: [
          { model: Comment, include: [Restaurant] },
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      .then(results => {
        // 找出評論中不重複的餐廳s
        const noRepeatCommentsRes = results.Comments.reduce((prev, curr) => {
          prev[curr.RestaurantId] = curr
          return prev
        }, {})

        // 整理送往前端資料
        const userQueried = {
          ...results.dataValues,
          Comments: Object.values(noRepeatCommentsRes),
          CommentsCount: Object.keys(noRepeatCommentsRes).length,
          FavoritedRestaurantsCount: results.FavoritedRestaurants.length,
          FollowerCount: results.Followers.length,
          FollowingsCount: results.Followings.length,
          isFollowed: results.Followers.map(user => user.id).includes(req.user.id)
        }

        const data = { userQueried }
        return cb(data)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  putUser: (req, res, cb) => {
    const userId = Number(req.params.id)
    const results = {
      status: 'failure',
      message: null
    }

    if (userId !== req.user.id) {
      results.message = '不要輕舉妄動'
      return cb(results)
    }

    if (!req.body.name) {
      results.message = '請輸入姓名'
      return cb(results)
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {

        return User
          .findByPk(userId)
          .then(userQueried => {
            return userQueried.update({
              name: req.body.name,
              image: file ? img.data.link : userQueried.image
            })
          })
          .then(() => {
            results.status = 'success'
            results.message = '成功更新個人頁面'
            results.userId = userId

            return cb(results)
          })
          .catch(err => {
            return res.status(500).json(err.stack)
          })
      })
    } else {
      return User
        .findByPk(userId)
        .then(userQueried => {
          return userQueried.update({
            name: req.body.name,
            image: userQueried.image
          })
        })
        .then(() => {
          results.status = 'success'
          results.message = '成功更新個人頁面'
          results.userId = userId

          return cb(results)
        })
        .catch(err => {
          return res.status(500).json(err.stack)
        })
    }
  },

  getTopUser: (req, res, cb) => {
    return User
      .findAll({
        include:
          [
            { model: User, as: 'Followers' }
          ]
      })
      .then(users => {

        users = users
          .map(user => {
            // 若為 req.user 自己則新增 isUserSelf 送至 views 判斷
            if (user.id === req.user.id) user.dataValues.isUserSelf = true

            return ({
              ...user.dataValues,
              FollowerCount: user.Followers.length,
              // isFollowed: req.user.Followings.some(followingUser => followingUser.id === user.id)
              isFollowed: req.user.Followings ? req.user.Followings.some(followingUser => followingUser.id === user.id) : false
            })
          })
          .sort((a, b) => { b.FollowerCount - a.FollowerCount })

        const results = { users }
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  addFavorite: (req, res, cb) => {
    return Favorite
      .create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      .then(() => {
        const results = {
          status: 'success',
          message: '成功加入收藏'
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  removeFavorite: (req, res, cb) => {
    return Favorite
      .findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then(favorite => {
        return favorite.destroy()
      })
      .then(() => {
        const results = {
          status: 'success',
          message: '成功移除收藏'
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  like: (req, res, cb) => {
    return Like
      .create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      .then(() => {
        const results = {
          status: 'success'
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  unlike: (req, res, cb) => {
    return Like
      .findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then(liked => {
        return liked.destroy()
      })
      .then(() => {
        const results = {
          status: 'success'
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })

  },

  addFollowing: (req, res, cb) => {
    return Followship
      .create({
        followerId: req.user.id,
        followingId: Number(req.params.userId)
      })
      .then(() => {
        const results = {
          status: 'success'
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  removeFollowing: (req, res, cb) => {
    return Followship
      .findOne({
        where: {
          followerId: req.user.id,
          followingId: Number(req.params.userId)
        }
      })
      .then(followship => {
        return followship.destroy()
      })
      .then(() => {
        const results = {
          status: 'success'
        }

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  }
}

module.exports = userService