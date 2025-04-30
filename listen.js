const app = require('./app.js');
const { PORT = 9090 } = process.env; // Default port or from environment

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
});