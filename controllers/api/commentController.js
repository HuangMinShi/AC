const commentService = require('../../services/commentService')

const commentController = {
  postComment: (req, res) => {
    return commentService.postComment(req, res, (data) => {
      if (data.status === 'failure') {
        return res.json(data)
      }
      return res.json(data)
    })
  },

}

module.exports = commentController