const { selectCommentsByArticleId } = require('../models/comments.model');// Kata 5 - Get /api/articles/:article_id/comments - to fetch all comments in an article
const { deleteCommentById } = require('../models/comments.model'); // Kata 8: DELETE /api/comments/:comment_id

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

// Kata 6
const { insertCommentByArticleId } = require('../models/comments.model');

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  insertCommentByArticleId(req.params.article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

// Kata 8: DELETE /api/comments/:comment_id
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};