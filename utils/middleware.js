const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, respose, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token === null) {
    request.user = null
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }