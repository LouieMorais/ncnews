const { selectArticleById } = require('../models/articles.model'); // Kata 3
const { selectAllArticles } = require('../models/articles.model'); // Kata 4 - Get /api/articles - to fetch all articles

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