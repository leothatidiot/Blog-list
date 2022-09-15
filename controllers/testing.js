const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

var initBlogs = [
  {
    title: "Things I don't know as of 2018",
    author: "Bobi",
    url: "https://127.0.0.1",
    likes: 2
  },
  {
    title: "Microservices and the First Law of Distributed Objects",
    author: "Bibo",
    url: "https://127.0.0.1",
    likes: 2
  }
]

var initUsers = [
  {
    username: "root",
    name: "Superuser",
    password: "salainen"
  },
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: 'salainen'
  }
]

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  for (let i = 0; i < 2; i++) {
    const userObject = new User({
      username: initUsers[i].username,
      passwordHash: await bcrypt.hash(initUsers[i].password, saltRoutds = 10),
      name: initUsers[i].name
    })

    initBlogs[i].user = userObject.id
    const blogObject = new Blog(initBlogs[i])
    const savedBlog = await blogObject.save()

    userObject.blog = userObject.blogs.concat(savedBlog.id)
    await userObject.save()
  }

  response.status(204).end()
})

module.exports = testingRouter