const db = require('../db/connection');

// Kata 9: GET /api/users
exports.selectAllUsers = () => {
  const queryStr = `
    SELECT username, name, avatar_url
    FROM users;
  `;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};