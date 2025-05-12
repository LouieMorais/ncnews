const { selectArticleById } = require('../models/articles.model'); // Kata 3
const { selectAllArticles } = require('../models/articles.model'); // Kata 4 - Get /api/articles - to fetch all articles
const { selectAllArticlesWithSorting } = require('../models/articles.model'); // Kata 10 - GET /api/articles (sorting queries)

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article: article});
    })
    .catch((err) => {
        next(err);
    });
};

// Kata 4 - Get /api/articles - to fetch all articles

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({ articles }); // Log: cut and pasted forgot to change article: article to articles
    })
    .catch((err) => {
        next(err);
    });
};

// Kata 7 - PATCH /api/articles/:article_id
const { updateArticleVotes } = require('../models/articles.model');

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

// Kata 10 - GET /api/articles (sorting queries)
exports.getAllArticlesWithSorting = (req, res, next) => {
    const { sort_by, order } = req.query;
    selectAllArticlesWithSorting(sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  };