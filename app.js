const express = require('express');
const app = express();

// Basic route to test server is running (optional)
app.get('/api', (req, res) => {
  res.status(200).send({ message: 'Server is running!' });
});

// Export the app for listen.js
module.exports = app;