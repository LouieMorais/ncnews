const express = require('express');
const endpointsJson = require('./endpoints.json');
const app = express();
app.use(express.json());
const { getTopics } = require('./controllers/topics.controller');
const { getArticleById } = require('./controllers/articles.controller');
const { getCommentsByArticleId, postCommentByArticleId, deleteComment } = require('./controllers/comments.controller');
const { patchArticleVotes, getAllArticlesWithFilters } = require('./controllers/articles.controller');
const { getAllUsers } = require('./controllers/users.controller');
const path = require('path');

// Kata 1-get-api
app.get('/api', (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

// Kata 2-get-topics
app.get('/api/topics', getTopics);

// Kata 3-get-article-by-id
app.get('/api/articles/:article_id', getArticleById);

// Kata 5 - Get /api/articles/:article_id/comments
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

// Kata 6
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

// Kata 7 - PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchArticleVotes);

// Kata 8: DELETE /api/comments/:comment_id
app.delete('/api/comments/:comment_id', deleteComment);

// Kata 9: GET /api/users
app.get('/api/users', getAllUsers);

// *** THE ONLY /api/articles HANDLER ***
app.get('/api/articles', getAllArticlesWithFilters);

// Error handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error: ', err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.use(express.static(path.resolve(__dirname, 'src')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './src/components/index.html'));
})
module.exports = app;