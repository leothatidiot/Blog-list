const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./helper')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

// initializing database
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  for (let i = 0; i < 2; i++) {
    let user = helper.initUsers[i]
    
    // 注册
    user.passwordHash = await bcrypt.hash(user.password, saltRounds = 10)
    const userObject = new User({
      username: user.username,
      passwordHash: user.passwordHash,
      name: user.name,
    })
    await userObject.save()
    // 登录 & token
    const userForToken = {
      username: user.username,
      id: userObject.id
    }
    user.token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60*60})
    
    // blogs init
    let blog = helper.initBlogs[i]
    blog.user = userObject.id
    let blogObject = new Blog(blog)

    const savedBlog = await blogObject.save()

    userObject.blogs = userObject.blogs.concat(savedBlog.id)
    await userObject.save()
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

describe('all posts', () => {
  test('POST /api/blogs successfully creates new blog post', async () => {
    const newBlog = {
      title: "ABC",
      author: "Chris P. Bacon",
      url: "https://www.youtube.com/watch?v=pMA3x-bc8iM",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${helper.initUsers[0].token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.getBlogs()
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
      .set('Authorization', `bearer ${helper.initUsers[0].token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.getBlogs()
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
      .set('Authorization', `bearer ${helper.initUsers[0].token}`)
      .send(newBlog)
      .expect(400)
  })

  test('return 401 Unauthorized if a token is not provided', async () => {
    const newBlog = {
      title: "ABC",
      author: "Chris P. Bacon",
      url: "https://www.youtube.com/watch?v=pMA3x-bc8iM",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletions', () => {
  test('deletion of existing blog', async () => {
    const blogsAtStart = await helper.getBlogs()
    const blogToDelete = await blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${helper.initUsers[0].token}`)
      .expect(204)
    
      const dbAfterDelete = await helper.getBlogs()
      expect(dbAfterDelete).toHaveLength(blogsAtStart.length - 1)
  })
  
  test('deletion of non-existing blog', async () => {
    const fakeId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${fakeId}`)
      .set('Authorization', `bearer ${helper.initUsers[0].token}`)
      .expect(400)
  })
})

test('update blog check likes', async () => {
  const blogAtStart = await helper.initBlogs[0]
  
  blogAfterUpdate = await {...blogAtStart}
  blogAfterUpdate.likes = await blogAtStart.likes + 1
  
  await api
    .put(`/api/blogs/${blogAfterUpdate.id}`)
    .send(blogAfterUpdate)
    .expect('Content-Type', /application\/json/)
  
  const dbAfterUpdate = await helper.getBlogs()
  expect(dbAfterUpdate[0].likes).toBe(blogAfterUpdate.likes)
})

describe('test /api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for (let user of helper.initUsers) {
      let userObject = new User(user)
      await userObject.save()
    }
  })

  test('username and password must be at least 3 characters long', async () => {
    const newUser = {
      username: "ro", // less than 3
      name: "Superuser",
      password: "salainen"
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  
  test('username must be unique', async () => {
    await api
      .post('/api/users')
      .send({
        username: "root",
        name: "Superuser",
        password: "salainen"
      }) // existed
      .expect(400)
  })
})
