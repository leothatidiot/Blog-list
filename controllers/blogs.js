const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (! request.body.hasOwnProperty('title') && 
     ! request.body.hasOwnProperty('url')) {
    response.status(400).end()
  } else {
    if (! request.body.hasOwnProperty('likes')) {
      request.body.likes = 0
    }
    const blog = await new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  Blog.findByIdAndRemove(request.params.id, (err) => {
    if (err) {
      response.status(400).end()
    } else {
      response.status(204).end()
    }
  })
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.updateOne(request.params, request.body)
  response.json(updatedBlog)
})

module.exports = blogsRouter