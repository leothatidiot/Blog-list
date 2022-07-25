const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
  if(! request.body.hasOwnProperty('title') && 
     ! request.body.hasOwnProperty('url')) {
    response.status(400).end()
  }

  if (! request.body.hasOwnProperty('likes')) {
    request.body.likes = 0
  }
  
  const blog = await new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter