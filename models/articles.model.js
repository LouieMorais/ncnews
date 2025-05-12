const db = require('../db/connection');
const { getValidatedSortBy, getValidatedOrder } = require('../utils/query-utils');


exports.selectArticleById = (article_id) => {
  if (!/^[0-9]+$/.test(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request: Invalid article ID' });
  }

  const queryStr = `
    SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
  `;

  return db.query(queryStr, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
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
exports.selectAllArticlesWithFilters = (topic, sort_by = 'created_at', order = 'desc') => {
  const sortField = getValidatedSortBy(sort_by);
  const sortOrder = getValidatedOrder(order);

  let queryStr = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  const queryParams = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortField} ${sortOrder};
  `;

  return db.query(queryStr, queryParams).then((result) => result.rows);
};

// Kata 11 - GET /api/articles (topic query)
exports.selectAllArticlesWithFilters = (topic, sort_by = 'created_at', order = 'desc') => {
  const sortField = getValidatedSortBy(sort_by);
  const sortOrder = getValidatedOrder(order);

  let queryStr = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  const queryParams = [];

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortField} ${sortOrder};
  `;

  return db.query(queryStr, queryParams).then((result) => result.rows);
};
