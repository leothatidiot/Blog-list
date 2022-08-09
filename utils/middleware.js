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

module.exports = { tokenExtractor }