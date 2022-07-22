const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('GET /api/blogs return json', () => {
  api
    .get('api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})