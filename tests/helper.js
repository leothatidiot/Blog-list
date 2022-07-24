const Blog = require('../models/blog')

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

const getDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initBlogs, getDb
}