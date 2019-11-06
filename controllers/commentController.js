const db = require('../models')
const { Comment } = db

const commentController = {
  postComment: (req, res) => {
    if (!req.body.text) {
      req.flash('error_msg', '請輸入評論再送出')
      res.redirect('back')
    }

    return Comment
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
  deleteComment: (req, res) => {
    if (!req.user.isAdmin) {
      req.flash('error_msg', '無刪除權限，洽網站管理員')
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    }

    return Comment
      .findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
        console.log(comment.RestaurantId);

        req.flash('success_msg', '成功刪除評論')
        return res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = commentController