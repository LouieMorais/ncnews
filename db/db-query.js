const db = require('./connection'); // Make sure the path is correct

console.log('Running database queries...');

// 1. Get all of the users
db.query('SELECT * FROM users;')
  .then(({ rows: users }) => {
    console.log('\n--- 1. All Users ---');
    console.log(users);
    // 2. Get all articles where topic is 'coding'
    // Use parameterized query ($1) for safety, even with simple values
    return db.query('SELECT * FROM articles WHERE topic = $1;', ['coding']);
  })
  .then(({ rows: codingArticles }) => {
    console.log('\n--- 2. Articles with topic "coding" ---');
    console.log(codingArticles);
    // 3. Get all comments where votes are less than zero
    return db.query('SELECT * FROM comments WHERE votes < $1;', [0]);
  })
  .then(({ rows: negativeVotesComments }) => {
    console.log('\n--- 3. Comments with negative votes ---');
    console.log(negativeVotesComments);
    // 4. Get all topics
    return db.query('SELECT * FROM topics;');
  })
  .then(({ rows: topics }) => {
    console.log('\n--- 4. All Topics ---');
    console.log(topics);
    // 5. Get all articles by user 'grumpy19'
    return db.query('SELECT * FROM articles WHERE author = $1;', ['grumpy19']);
  })
  .then(({ rows: grumpyArticles }) => {
    console.log('\n--- 5. Articles by user "grumpy19" ---');
    console.log(grumpyArticles);
    // 6. Get all comments with more than 10 votes
    return db.query('SELECT * FROM comments WHERE votes > $1;', [10]);
  })
  .then(({ rows: popularComments }) => {
    console.log('\n--- 6. Comments with more than 10 votes ---');
    console.log(popularComments);
  })
  .catch((err) => {
    console.error('\nError executing query:', err);
  })
  .finally(() => {
    // Always close the connection when done
    console.log('\nClosing database connection...');
    db.end();
  });