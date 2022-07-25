const Blog = require('../models/blog')
const helper = require('./helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

// initializing database
beforeEach(async () => {
  await Blog.deleteMany()
  for (let blog of helper.initBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('GET /api/blogs return json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
  const firstBlog = await api.get('/api/blogs')
  expect(firstBlog.body[0].id).toBeDefined()
})

test('POST /api/blogs successfully creates new blog post', async () => {
  const newBlog = {
    title: "ABC",
    author: "Chris P. Bacon",
    url: "https://www.youtube.com/watch?v=pMA3x-bc8iM",
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.getDb()
  expect(blogsAtEnd).toHaveLength(helper.initBlogs.length + 1)
})

test('if likes property missing in request, default give 0', async () => {
  const newBlog = {
    title: "ABC",
    author: "Chris P. Bacon",
    url: "https://www.youtube.com/watch?v=pMA3x-bc8iM",
    // likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.getDb()
  expect(blogsAtEnd[2].likes).toBeDefined()
})

test('if title & url property missing, backend respond 400', async () => {
  const newBlog = {
    // title: "ABC",
    author: "Chris P. Bacon",
    // url: "https://www.youtube.com/watch?v=pMA3x-bc8iM",
    likes: 2
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})