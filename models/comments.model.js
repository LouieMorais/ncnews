// Kata 5 - Get /api/articles/:article_id/comments - to fetch all comments in an article
const db = require('../db/connection');

exports.selectCommentsByArticleId = async (article_id) => {
  // Validate article_id
  if (!/^[0-9]+$/.test(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request: Invalid article ID' });
  }

  // Check if the article exists
  const articleCheckQuery = `
    SELECT * FROM articles
    WHERE article_id = $1;
  `;
  const articleCheckResult = await db.query(articleCheckQuery, [article_id]);

  if (articleCheckResult.rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article not found' });
  }

  // Fetch comments for the article
  const queryStr = `
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await db.query(queryStr, [article_id]);

  return result.rows;
};