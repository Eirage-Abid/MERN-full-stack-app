// __tests__/api.test.js
const request = require('supertest');
const app = require('../app');  // Your Express app

test('GET /api/users should return a list of users', async () => {
  const response = await request(app).get('/api/users');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});
