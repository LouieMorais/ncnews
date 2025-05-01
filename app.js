const express = require('express');
const endpointsJson = require('./endpoints.json');
const app = express();
const { getTopics } = require('./controllers/topics.controller') // Log: forgot to add this call and failed test

app.get('/api', (req, res) => {
  res.status(200).send({ endpoints: endpointsJson }); 
});

// Log: forgot to add the below to fetch topics
// Log 2: wrote api/... instead of /api/... - finally passed!
app.get('/api/topics', getTopics);  


module.exports = app;