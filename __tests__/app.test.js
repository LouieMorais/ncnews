/* Set up your test imports here */
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index'); // captain's log didn't close the path correctly ..db instead of ../db - second test failed
const endpointsJson = require('../endpoints.json');


/* Set up your beforeEach & afterAll functions here */

// 1. call the test databse before each test
// Note: beforeAll would save a huge ammount fo time BUT
// it wouldn't be isolated anymore - changes made by one test 
// would trickled down to all the tests afterwards
// beforeEach is taking 40 seconds per test
beforeEach(() => {
  return seed(testData);
});

// 2. save some electricity by closing the db connection after the tests are done
afterAll(() => {
  return db.end();
})


// Kata 1 - CORE: GET /api - Branch 1-get-api
describe('GET /api', () => {
  test('200: Responds with an object detailing the documentation for each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200) 
      // I decided to call the whole body and then ask for the endpoints
      // Original code asked for endpoints directly
      .then(({ body }) => { 
        console.log('We found a body!', body) // Log: last error before passing wsa that body was spelled as 'bo'
        expect(body.endpoints).toEqual(endpointsJson);
      });
      });
  });

  // Kata 2 - CORE: GET /api/topics
  describe('GET /api', () => {
    test('200: Responds with an object (?) containing topics', () => {
      return request(app)
      // Log: my heart goes to all the tests that died in the battlefield 
      // because I copied the test above and didn't add 'topics' to the path
        .get('/api/topics')
        .expect(200) 
        .then(({ body }) => { 
          expect(body.topics).toBeInstanceOf(Array);
          expect(body.topics.length).toBeGreaterThan(0);
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');
          })
        });
        });
    });
  
  // Kata 3 - CORE: GET /api/articles/:article_id
  describe('GET /api/articles/:article_id', () => {
    test('200: Matches an article by its id', () => {
      const ARTICLE_ID = 1; // My chosen id as it will definitely match
      return request(app)
        .get(`/api/articles/${ARTICLE_ID}`) // Log: remember that once there is a variable it must be enclosed by ticks, duh!
        .expect(200) 
        .then(({ body }) => { 
          expect(body.article).toBeInstanceOf(Object); // Log: rememeber article (column) and NOT articleS (table) ''
          expect(body.article.article_id).toBe(ARTICLE_ID); 
          expect(body.article).toHaveProperty('author', expect.any(String)); // Log: re-study the expect.any bit
          expect(body.article).toHaveProperty('title', expect.any(String)); 
          expect(body.article).toHaveProperty('article_img_url', expect.any(String)); 
          })
        });
        test('404: valid but non-existent id', () => {
          const ARTICLE_ID = 9999;
          return request(app)
            .get(`/api/articles/${ARTICLE_ID}`)
            .expect(404) 
            .then(({ body }) => { 
              expect(body.msg).toBe('Article not found');
            });
        });
      
        test('400: invalid id', () => {
          const ARTICLE_ID = 'not-a-valid-id';
          return request(app)
            .get(`/api/articles/${ARTICLE_ID}`)
            .expect(400) 
            .then(({ body }) => { 
              expect(body.msg).toBe('Bad Request: Invalid article ID');
            });
        });
    });

    // Kata 4 - Get /api/articles - to fetch all articles
    describe('GET /api/articles', () => {
      test('200: returns all articles', async () => {
        const res = await request(app).get('/api/articles').expect(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles[0]).toHaveProperty('author'); // Log 1 failed tests becuase articles.author instead of author
        expect(res.body.articles[0]).toHaveProperty('comment_count'); // Log 2 failed because articles instead of articles[0]
        expect(res.body.articles[0]).toHaveProperty('created_at');
        expect(res.body.articles[0]).toHaveProperty('votes');
        expect(res.body.articles[0]).not.toHaveProperty('body'); // Log 3 failed because forgot .not
      })
    })

    // Kata 5 - Get /api/articles/:article_id/comments - to fetch all comments in an article
    describe('GET /api/articles/:article_id/comments', () => {
      it('200: responds with an array of comments for the given article', async () => {
        const res = await request(app).get('/api/articles/1/comments').expect(200);
        expect(Array.isArray(res.body.comments)).toBe(true);
        if (res.body.comments.length > 0) {
          expect(res.body.comments[0]).toHaveProperty('comment_id');
          expect(res.body.comments[0]).toHaveProperty('body');
        }
      });
    
      it('400: responds with bad request for invalid article ID', async () => {
        const res = await request(app).get('/api/articles/not-a-number/comments').expect(400);
        expect(res.body.msg).toBe('Bad Request: Invalid article ID');
      });
    
      it('404: responds with not found for non-existent article', async () => {
        const res = await request(app).get('/api/articles/9999/comments').expect(404);
        expect(res.body.msg).toBe('Article not found');
      });
    });

    // Kata 6

    describe('POST /api/articles/:article_id/comments', () => {
      it('201: adds a comment and responds with the new comment', async () => {
        const newComment = { username: 'butter_bridge', body: 'Great article!' };
        const res = await request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(201);
        expect(res.body.comment).toHaveProperty('comment_id');
        expect(res.body.comment).toHaveProperty('body', 'Great article!');
        expect(res.body.comment).toHaveProperty('author', 'butter_bridge');
        expect(res.body.comment).toHaveProperty('article_id', 1);
      });
    
      it('400: responds with bad request for invalid article ID', async () => {
        const newComment = { username: 'butter_bridge', body: 'Great article!' };
        const res = await request(app)
          .post('/api/articles/not-a-number/comments')
          .send(newComment)
          .expect(400);
        expect(res.body.msg).toBe('Bad Request: Invalid article ID');
      });
    
      it('400: responds with bad request for missing required fields', async () => {
        const res = await request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'butter_bridge' })
          .expect(400);
        expect(res.body.msg).toBe('Bad Request: Missing required fields');
      });
    
      it('404: responds with not found for non-existent article', async () => {
        const newComment = { username: 'butter_bridge', body: 'Great article!' };
        const res = await request(app)
          .post('/api/articles/9999/comments')
          .send(newComment)
          .expect(404);
        expect(res.body.msg).toBe('Article not found');
      });
    });

    // Kata 7 - PATCH /api/articles/:article_id
describe('PATCH /api/articles/:article_id', () => {
  it('200: updates the votes and responds with the updated article', async () => {
    const res = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200);
    expect(res.body.article).toHaveProperty('votes');
  });

  it('400: responds with bad request for invalid article ID', async () => {
    const res = await request(app)
      .patch('/api/articles/not-a-number')
      .send({ inc_votes: 1 })
      .expect(400);
    expect(res.body.msg).toBe('Bad Request: Invalid article ID');
  });

  it('400: responds with bad request for missing or invalid inc_votes', async () => {
    const res = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'not-a-number' })
      .expect(400);
    expect(res.body.msg).toBe('Bad Request: inc_votes must be a number');
  });

  it('404: responds with not found for non-existent article', async () => {
    const res = await request(app)
      .patch('/api/articles/9999')
      .send({ inc_votes: 1 })
      .expect(404);
    expect(res.body.msg).toBe('Article not found');
  });
});

// Kata 8: DELETE /api/comments/:comment_id
describe('DELETE /api/comments/:comment_id', () => {
  it('204: deletes the comment and responds with no content', async () => {
    await request(app).delete('/api/comments/1').expect(204);
  });

  it('400: responds with bad request for invalid comment ID', async () => {
    const res = await request(app).delete('/api/comments/not-a-number').expect(400);
    expect(res.body.msg).toBe('Bad Request: Invalid comment ID');
  });

  it('404: responds with not found for non-existent comment', async () => {
    const res = await request(app).delete('/api/comments/9999').expect(404);
    expect(res.body.msg).toBe('Comment not found');
  });
});

// Kata 9: GET /api/usersdescribe('GET /api/users', () => {
describe('GET /api/users', () => {
  it('200: responds with an array of user objects', async () => {
    const res = await request(app).get('/api/users').expect(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users[0]).toHaveProperty('username');
    expect(res.body.users[0]).toHaveProperty('name');
    expect(res.body.users[0]).toHaveProperty('avatar_url');
  });
});

// Kata 10 - GET /api/articles (sorting queries)
describe('GET /api/articles (sorting queries)', () => {
  it('200: sorts articles by any valid column and order', async () => {
    const res = await request(app).get('/api/articles?sort_by=title&order=asc').expect(200);
    expect(Array.isArray(res.body.articles)).toBe(true);
    // Optionally, check that the array is sorted as expected
  });

  it('400: responds with bad request for invalid sort_by or order', async () => {
    await request(app).get('/api/articles?sort_by=notacolumn').expect(400);
    await request(app).get('/api/articles?order=notanorder').expect(400);
  });
});