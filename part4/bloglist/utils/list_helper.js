var _ = require('lodash');

const dummy = (blogs) => {
  if (blogs) {
    return 1;
  }
};

const totalLikes = (blogs) => {

  if (blogs.length === 0) {
    return 0;
  }

  // if list has only one blog, total likes = blog.likes
  if (blogs.length === 1) {
    return blogs[0].likes;
  }

  // if many blogs, total all likes
  const reducer = (sum, blogs) => {
    return sum + blogs.likes;
  }

  return blogs.reduce(reducer, 0);
  
}

const favoriteBlog = (blogs) => {
  const callback = (previousBlog, currentBlog) => {
    return currentBlog.likes > previousBlog.likes 
    ? currentBlog
    : previousBlog
  }

  return blogs.reduce(callback, { likes: 0 })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  
  // count authors by occurrence
  const authorsCount = _.countBy(blogs, 'author')
  // get max blog count
  const maxBlogCount = _.max(Object.values(authorsCount))
  // find key that corresponds with max blog count
  const author = _.findKey(authorsCount, o => o === maxBlogCount)
  
  return {
    author: author,
    blogs: maxBlogCount
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};