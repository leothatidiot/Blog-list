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

test('deletion of existing blog', async () => {
  const dbAtStart = await helper.getDb()
  const blogToDelete = await dbAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
    const dbAfterDelete = await helper.getDb()
    expect(dbAfterDelete).toHaveLength(dbAtStart.length - 1)
})

test('deletion of non-existing blog', async () => {
  await api
    .delete(`/api/blogs/${helper.nonExistingId()}`)
    .expect(400)
})

test('update blog check likes', async () => {
  const blogAtStart = await helper.initBlogs[0]
  
  blogAfterUpdate = await {...blogAtStart}
  blogAfterUpdate.likes = await blogAtStart.likes + 1
  
  await api
    .put(`/api/blogs/${blogAfterUpdate.id}`)
    .send(blogAfterUpdate)
    .expect('Content-Type', /application\/json/)
  
  const dbAfterUpdate = await helper.getDb()
  expect(dbAfterUpdate[0].likes).toBe(blogAfterUpdate.likes)
  console.log(dbAfterUpdate)
})