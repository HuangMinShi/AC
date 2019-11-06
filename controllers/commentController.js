const db = require('../models')
const { Comment } = db

const commentController = {
  postComment: (req, res) => {
    if (!req.body.text) {
      req.flash('error_msg', '請輸入評論再送出')
      res.redirect('back')
    }

    Comment
      .create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id,
      })
      .then(comment => {
        req.flash('success_msg', '成功新增評論')
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
      .catch(err => {
        console.log(err)
      })
  },

}

module.exports = commentController