const Blog = require('../models/blog')
const User = require('../models/user')

const initBlogs = [
  {
    title: ":)",
    author: "Bobi",
    url: "https://127.0.0.1",
    likes: 2
  },
  {
    title: "(:",
    author: "Bibo",
    url: "https://127.0.0.1",
    likes: 2
  }
]

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog(initBlogs[0]) // will remove this soon
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const initUsers = [
  {
    username: "root",
    name: "Superuser",
    password: "salainen"
  },
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: '123456'
  }
]

const getUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initBlogs, getBlogs, nonExistingId, initUsers, getUsers
}