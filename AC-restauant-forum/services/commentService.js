const db = require('../models')
const { Comment } = db

const commentService = {
  postComment: (req, res, cb) => {
    const results = {
      status: 'failure',
      message: '請輸入評論再送出'
    }

    if (!req.body.text) {
      return cb(results)
    }

    return Comment
      .create({
        text: req.body.text,
        RestaurantId: Number(req.body.restaurantId),
        UserId: req.user.id,
      })
      .then(() => {
        results.status = 'success'
        results.message = '成功新增評論'
        results.RestaurantId = req.body.restaurantId

        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  },

  deleteComment: (req, res, cb) => {
    const results = {
      status: 'failure',
      message: '無刪除權限，洽網站管理員',
      restaurantId: req.body.restaurantId
    }

    if (!req.user.isAdmin) {
      return cb(results)
    }

    return Comment
      .findByPk(req.params.id)
      .then(comment => {
        return comment.destroy()
      })
      .then(() => {
        results.status = 'success'
        results.message = '成功刪除評論'
        return cb(results)
      })
      .catch(err => {
        return res.status(500).json(err.stack)
      })
  }
}

module.exports = commentService