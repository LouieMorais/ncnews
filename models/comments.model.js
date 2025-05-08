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

// Kata 6
exports.insertCommentByArticleId = async (article_id, username, body) => {
  // Validate article_id
  if (!/^[0-9]+$/.test(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request: Invalid article ID' });
  }
  // Validate required fields
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: 'Bad Request: Missing required fields' });
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

  // Insert the comment
  const insertQuery = `
    INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING comment_id, body, article_id, author, votes, created_at;
  `;
  const insertResult = await db.query(insertQuery, [body, username, article_id]);
  return insertResult.rows[0];
};