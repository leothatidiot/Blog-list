const mongoose = require('mongoose')
const config = require('../utils/config')

// connect MongoDB
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

// define schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)