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

const mostLikes = (blogs) => {

  if (blogs.length === 0) {
    return 0;
  }

  if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes
    }
  }

  // group likes by author
  const authorLikes = blogs.reduce((all, item) => {
    if (all[item.author] === undefined) {
      all[item.author] = []
    }

    all[item.author].push(item.likes)
    return all
  }, {})
  
  // reducer to add array of likes of each author
  const sum = (a,b) => {
    return a + b
  }

  // reduce likes to array of sums
  const sumLikes = Object.values(authorLikes).map(value => value.reduce(sum, 0))
  // find sum with max likes
  const maxLikes = Math.max(...sumLikes)
  // get the author matching the max likes
  const faveAuthor = Object.keys(authorLikes)[sumLikes.indexOf(maxLikes)]

  return {
    author: faveAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};