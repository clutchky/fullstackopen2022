const Blog = require('../models/blog');

// Blogs to add
const initialBlogs = [
  {
    title: 'Alive in Retrospect',
    author: 'Izza Montederamos',
    url: 'http://aliveinretrospect.com',
    likes: 123,
  },
  {
    title: 'The Patbingsoo',
    author: 'Frederick Fleur',
    url: 'https://thepatbingsoo.com/',
    likes: 123
  }
];
// blogs in db
const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map(blog => blog.toJSON());
}

module.exports = {
  initialBlogs,
  blogsInDb
}