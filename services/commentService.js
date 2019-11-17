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
}

module.exports = commentService