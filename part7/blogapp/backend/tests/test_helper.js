const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");

// Blogs to add
const initialBlogs = [
  {
    title: "Alive in Retrospect",
    author: "Izza Montederamos",
    url: "http://aliveinretrospect.com",
    likes: 123,
  },
  {
    title: "The Patbingsoo",
    author: "Frederick Fleur",
    url: "https://thepatbingsoo.com/",
    likes: 123,
  },
];
// blogs in db
const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON());
};

// initial users in db
const usersInDb = async () => {
  const users = await User.find({});

  return users.map((user) => user.toJSON());
};

// empty user
const emptyUser = async () => {
  const user = await new User({
    name: "Juan dela Cruz",
  });

  return user;
};

//blogWithToken
const blogWithToken = async () => {
  const userId = await User.find({});

  const blogToDelete = new Blog({
    title: "test",
    author: "test",
    url: "test",
    likes: 0,
    user: userId[0]._id,
  });

  return blogToDelete;
};

//testUser
const testUser = async () => {
  const passwordHash = await bcrypt.hash("testpassword", 10);
  const user = new User({
    username: "testuser",
    passwordHash,
    name: "Test User",
  });

  return user;
};

// testUserToken
const testUserToken = async () => {
  const user = await User.find({});

  const userToken = {
    username: user[0].username,
    id: user[0]._id,
  };

  const token = jwt.sign(userToken, process.env.SECRET, { expiresIn: 60 * 60 });

  return token;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  emptyUser,
  testUserToken,
  testUser,
  blogWithToken,
};
