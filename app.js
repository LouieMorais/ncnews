const express = require('express');
const endpointsJson = require('./endpoints.json');
const app = express();
const { getTopics } = require('./controllers/topics.controller'); // Log: forgot to add this call and failed test
const { getArticleId, getArticleById } = require('./controllers/articles.controller'); 

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