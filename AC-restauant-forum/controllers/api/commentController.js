const commentService = require('../../services/commentService')

const commentController = {
  postComment: (req, res) => {
    return commentService.postComment(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteComment: (req, res) => {
    return commentService.deleteComment(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = commentController