const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, respose, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // return authorization.substring(7)
    request.token = authorization.substring(7)
  }
  // return null
  else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else {
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }