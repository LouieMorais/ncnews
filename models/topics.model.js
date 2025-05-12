const db = require('../db/connection');

// Kata 11 - GET /api/articles (topic query)
exports.selectAllTopics = async () => {
    const query = `SELECT slug, description FROM topics;`; // Note: remember ";" is required for SQL commands
    return db.query(query).then((result) => {
        return result.rows;
    });
};

// Kata 11 - GET /api/articles (topic query)
exports.checkTopicExists = (topic) => {
    return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Topic not found' });
        }
      });
  };