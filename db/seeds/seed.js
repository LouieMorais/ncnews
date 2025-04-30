const db = require('../connection');
const format = require('pg-format');
const { convertTimestampToDate } = require('./utils');

const seed = ({ topicData, userData, articleData, commentData }) => {
  let insertedArticlesData;

  return db.query(`DROP TABLE IF EXISTS comments;`)
    .then(() => { return db.query(`DROP TABLE IF EXISTS articles;`); })
    .then(() => { return db.query(`DROP TABLE IF EXISTS users;`); })
    .then(() => { return db.query(`DROP TABLE IF EXISTS topics;`); })
    .then(() => {
      console.log("Dropped tables (if they existed).");
      console.log("Creating topics table...");
      return db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL,
        img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      console.log("Table 'topics' created.");
      console.log("Creating users table...");
      return db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      console.log("Table 'users' created.");
      console.log("Creating articles table...");
      return db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000) DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);
    })
    .then(() => {
      console.log("Table 'articles' created.");
      console.log("Creating comments table...");
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT NOT NULL REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR NOT NULL REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      console.log("Table 'comments' created.");
      console.log("Inserting data into topics...");
      const formattedTopicData = topicData.map(topic => [topic.slug, topic.description, topic.img_url]);
      const topicsInsertQuery = format(
        'INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;',
        formattedTopicData
      );
      return db.query(topicsInsertQuery);
    })
    .then((result) => {
      console.log(`Inserted ${result.rows.length} rows into topics.`);
      console.log("Inserting data into users...");
      const formattedUserData = userData.map(user => [user.username, user.name, user.avatar_url]);
      const usersInsertQuery = format(
        'INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;',
        formattedUserData
      );
      return db.query(usersInsertQuery);
    })
    .then((result) => {
      console.log(`Inserted ${result.rows.length} rows into users.`);
      console.log("Inserting data into articles...");
      const formattedArticleData = articleData.map(article => [
        article.title,
        article.topic,
        article.author,
        article.body,
        convertTimestampToDate(article.created_at),
        article.votes,
        article.article_img_url
      ]);
      const articlesInsertQuery = format(
        'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;',
        formattedArticleData
      );
      return db.query(articlesInsertQuery);
    })
    .then((result) => {
      insertedArticlesData = result.rows;
      console.log(`Inserted ${insertedArticlesData.length} rows into articles.`);

      const articleTitleToIdMap = {};
      insertedArticlesData.forEach(article => {
        articleTitleToIdMap[article.title] = article.article_id;
      });

      console.log("Inserting data into comments...");
      const formattedCommentData = commentData.map(comment => {
        const articleId = articleTitleToIdMap[comment.article_title];
        if (!articleId) {
          console.warn(`WARN: Could not find article_id for comment with title: "${comment.article_title}". Skipping comment.`);
          return null;
        }
        return [
          comment.body,
          comment.votes,
          comment.author,
          articleId,
          convertTimestampToDate(comment.created_at)
        ];
      }).filter(row => row !== null);

      if (formattedCommentData.length === 0) {
         console.log("No valid comments to insert after filtering.");
         return { rows: [] };
      }

      const commentsInsertQuery = format(
        'INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *;',
        formattedCommentData
      );
      return db.query(commentsInsertQuery);
    })
    .then((result) => {
      if (result && result.rows) {
         console.log(`Inserted ${result.rows.length} rows into comments.`);
      }
      console.log("Data insertion complete.");
    })
    .catch((err) => {
      console.error("ERROR during seeding process:", err);
      if (insertedArticlesData && err.table === 'comments') {
         console.error("Articles inserted before comment error:", JSON.stringify(insertedArticlesData.map(a => ({id: a.article_id, title: a.title})), null, 2));
      }
      throw err;
    });
};

module.exports = seed;