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

module.exports = {
  dummy,
  totalLikes
};