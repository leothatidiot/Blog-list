const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let reducer = (sum, blog) => {
    return sum + blog.likes;
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let reducer = (mostLikeBlog, blog) => {
    return mostLikeBlog.likes > blog.likes
      ? mostLikeBlog
      : blog
  }
  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, blogs[0])
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}