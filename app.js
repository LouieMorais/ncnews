const express = require('express');
const endpointsJson = require('./endpoints.json');
const app = express();

app.get('/api', (req, res) => {
  res.status(200).send({ endpoints: endpointsJson }); // Log: forgot to change this to send endpoints 
});


module.exports = app;