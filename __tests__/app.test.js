/* Set up your test imports here */
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index'); // captain's log didn't close the path correctly ..db instead of ../db - second test failed
const endpointsJson = require("../endpoints.json");


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
describe.skip("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200) 
      // I decided to call the whole body and then ask for the endpoints
      // Original code asked for endpoints directly
      .then(({ body }) => { 
        console.log('We found a body!', body) // Log: last error before passing wsa that body was spelled as "bo"
        expect(body.endpoints).toEqual(endpointsJson);
      });
      });
  });

  // Kata 2 - CORE: GET /api/topics
  describe("GET /api", () => {
    test("200: Responds with an object (?) containing topics", () => {
      return request(app)
        .get("/api")
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
  