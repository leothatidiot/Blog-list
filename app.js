const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')

const app = express()

app.use(cors())
app.use(express.json())
app.use(blogsRouter)

module.exports = app