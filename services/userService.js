const db = require('../models')
const { User, Comment, Restaurant } = db

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





}

module.exports = userService