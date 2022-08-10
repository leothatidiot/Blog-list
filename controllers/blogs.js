const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(
    'user',
    { username: 1, name: 1, id: 1 }
  )
  response.json(blogs)
})

blogsRouter.post('/', userExtractor,async (request, response) => {  
  if (!request.body.hasOwnProperty('title') || 
      !request.body.hasOwnProperty('url')) {
    response.status(400).end()
  }
  
  if (!request.body.hasOwnProperty('likes')) {
    request.body.likes = 0
  }

  const user = request.user

  const blog = new Blog({
    user: user._id, // uploader
    url: request.body.url,
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog === null) {
    return response.status(400) // not exist, 400 bad request
  }

  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'not the creator'}) // 401 unauthorized
  }

  await Blog.findByIdAndRemove(blog.id)
  response.status(204).end() // deleted
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.updateOne(request.params, request.body)
  response.json(updatedBlog)
})

module.exports = blogsRouter