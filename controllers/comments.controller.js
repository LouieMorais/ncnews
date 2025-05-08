// Kata 5 - Get /api/articles/:article_id/comments - to fetch all comments in an article
const { selectCommentsByArticleId } = require('../models/comments.model');

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