const commentService = require('../services/commentService')

const commentController = {
  postComment: (req, res) => {
    return commentService.postComment(req, res, (data) => {
      if (data.status === 'failure') {
        req.flash('error_msg', data.message)
        return res.redirect('back')
      }
      req.flash('success_msg', data.message)
      return res.redirect(`/restaurants/${data.RestaurantId}`)
    })
  },

  deleteComment: (req, res) => {
    console.log(req.params);

    if (!req.user.isAdmin) {
      req.flash('error_msg', '無刪除權限，洽網站管理員')
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    }

    return Comment
      .findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
        req.flash('success_msg', '成功刪除評論')
        return res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

module.exports = commentController