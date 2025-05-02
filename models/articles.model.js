const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
    if (!/^[0-9]+$/.test(article_id)) {
        return Promise.reject({ status: 400, msg: 'Bad Request: Invalid article ID'});
    }

    const queryStr = `
      SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
      FROM articles
      WHERE article_id = $1;
    `; // 

    return db.query(queryStr, [article_id])
      // Fix 1: Correct syntax for the .then() callback
      .then((result) => {
          // Check if article was found
          if (result.rows.length === 0) {
            // Fix 2: Use status 404 for "Not Found"
            return Promise.reject({ status: 404, msg: 'Article not found' });
          }
          // Return the found article
          return result.rows[0];
      });
};