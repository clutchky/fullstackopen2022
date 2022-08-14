const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

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

beforeEach( async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  
  expect(response.body).toHaveLength(initialBlogs.length)
});

test('a specific blog is in the returned blog list', async () => {
  const response = await api.get('/api/blogs');
  const titles = response.body.map(r => r.title);

  expect(titles).toContain('The Patbingsoo');
});

test('there is an id property', async () => {
  const response = await api.get('/api/blogs');
  const idProperty = Object.keys(response.body[0])[4]

  expect(idProperty).toBeDefined()
});

test('can post a blog entry', async () => {
  const newBlog = {
    title: 'sample blog entry',
    author: 'sample author',
    url: 'http://sampleblog.com',
    likes: 0
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const titles = response.body.map(r => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain(
    'sample blog entry'
  )
});

afterAll(() => {
  mongoose.connection.close();
})