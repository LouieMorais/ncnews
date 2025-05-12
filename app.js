const express = require('express');
const endpointsJson = require('./endpoints.json');
const app = express(); 
app.use(express.json()); // Kata 6
const { getTopics } = require('./controllers/topics.controller'); // Log: forgot to add this call and failed test
const { getArticleId, getArticleById } = require('./controllers/articles.controller'); 
const { getAllArticles } = require('./controllers/articles.controller'); // Kata 4 - Get /api/articles - to fetch all articles
const { getCommentsByArticleId } = require('./controllers/comments.controller'); // Kata 5 - Get /api/articles/:article_id/comments - to fetch all comments in an article
const { postCommentByArticleId } = require('./controllers/comments.controller'); // Kata 6
const { patchArticleVotes } = require('./controllers/articles.controller'); // Kata 7 - PATCH /api/articles/:article_id
const { deleteComment } = require('./controllers/comments.controller'); // Kata 8: DELETE /api/comments/:comment_id
const { getAllUsers } = require('./controllers/users.controller'); // Kata 9: GET /api/users
const { getAllArticlesWithSorting } = require('./controllers/articles.controller'); // Kata 10 - GET /api/articles (sorting queries)

// Kata 1-get-api
app.get('/api', (req, res) => {
  res.status(200).send({ endpoints: endpointsJson }); 
});

// Kata 2-get-topics
// Log: forgot to add the below to fetch topics
// Log 2: wrote api/... instead of /api/... - finally passed!
app.get('/api/topics', getTopics);  

// Kata 3-get-article-by-id
app.get('/api/articles/:article_id', getArticleById);  

// Kata 4 - Get /api/articles - to fetch all articles
// app.get('/api/articles', getAllArticles);  // This was causing Kata 10 to fail

// Kata 5 - Get /api/articles/:article_id/comments - to fetch all comments in an article
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

// Kata 6
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

// Kata 7 - PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchArticleVotes);

// Kata 8: DELETE /api/comments/:comment_id
app.delete('/api/comments/:comment_id', deleteComment);

// Kata 9: GET /api/users
app.get('/api/users', getAllUsers);

// Kata 10 - GET /api/articles (sorting queries)
app.get('/api/articles', getAllArticlesWithSorting);

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


module.exports = app;