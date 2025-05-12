const db = require('../db/connection');

exports.selectAllTopics = async () => {
    const query = `SELECT slug, description FROM topics;`; // Note: remember ";" is required for SQL commands
    return db.query(query).then((result) => {
        return result.rows;
    });
};