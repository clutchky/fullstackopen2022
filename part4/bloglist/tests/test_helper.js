const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

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

// initial users in db
const usersInDb = async () => {
  const users = await User.find({});

  return users.map(user => user.toJSON());
}

// empty user
const emptyUser = async () => {
  const user = await new User({
    name: 'Juan dela Cruz',
  });

  return user;
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  emptyUser,
}