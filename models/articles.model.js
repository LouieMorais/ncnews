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

// Kata 4 - Get /api/articles - to fetch all articles

exports.selectAllArticles = () => {
  const queryStr = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;  
    `;

    return db.query(queryStr).then((result) => {
      return result.rows;
    });
};

// Kata 7 - PATCH /api/articles/:article_id
exports.updateArticleVotes = (article_id, inc_votes) => {
  if (!/^[0-9]+$/.test(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request: Invalid article ID' });
  }
  if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad Request: inc_votes must be a number' });
  }

  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  return db.query(queryStr, [inc_votes, article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    return result.rows[0];
  });
};

// Kata 10 - GET /api/articles (sorting queries)
exports.selectAllArticlesWithSorting = (sort_by = 'created_at', order = 'desc') => {
  const validSorts = [
    'author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'
  ];
  const validOrders = ['asc', 'desc'];

  // Only validate if the query param is present
  if (sort_by && !validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort or order query' });
  }
  if (order && !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort or order query' });
  }

  const queryStr = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by || 'created_at'} ${(order || 'desc').toUpperCase()};
  `;

  return db.query(queryStr).then((result) => result.rows);
};