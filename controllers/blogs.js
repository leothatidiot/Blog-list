const blogsRouter = require('express').Router()
const res = require('express/lib/response')
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(
    'user',
    { username: 1, name: 1, id: 1 }
  )
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {  
  if (request.user === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!request.body.hasOwnProperty('title') || 
      !request.body.hasOwnProperty('url')) {
    return response.status(400).end()
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
  if (request.user === null) {
    return response.status(400).json({ error: 'token not provided'})
  }
  
  const blog = await Blog.findById(request.params.id)

  if (blog === null) {
    return response.status(400).json({error: 'this blog not exist'}) // 400 bad request
  }

  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'not the creator'}) // 401 unauthorized
  }

  await Blog.findByIdAndRemove(blog.id)
  response.status(204).end() // deleted
})

blogsRouter.put('/:id', (request, response) => {
  Blog.updateOne({ _id: request.params.id }, request.body)
    .then(response.status(202).json(request.body))
    .catch(response.status(400).json({error: 'this blog not exist'}))
})

module.exports = blogsRouter