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
    return commentService.deleteComment(req, res, (data) => {
      if (data.status === 'failure') {
        req.flash('error_msg', data.message)
        return res.redirect(`/restaurants/${data.restaurantId}`)
      }

      req.flash('success_msg', data.message)
      return res.redirect(`/restaurants/${data.restaurantId}`)
    })
  }
}

module.exports = commentController