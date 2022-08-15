const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../tests/test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach( async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  
  expect(response.body).toHaveLength(helper.initialBlogs.length)
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

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain(
    'sample blog entry'
  )
});

test('likes property defaults to zero if not defined', async () => {
  const newBlogNoLikes = {
    title: 'unliked blog',
    author: 'sample author',
    url: 'http://sampleblog.com',
  };

  await api
    .post('/api/blogs')
    .send(newBlogNoLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const response = await api.get('/api/blogs');

  const likesProperty = Object.values(response.body[helper.initialBlogs.length])[3];

  expect(likesProperty).toBe(0);
});

test('missing title and url is not added', async () => {
  const newBlog = {
    author: 'Anonymous'
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a note can be deleted', async () => {
  const startingBlogs = await helper.blogsInDb();
  const blogToRemove = startingBlogs[0];

  await api
    .delete(`/api/blogs/${blogToRemove.id}`)
    .expect(204)

  const endBlogs = await helper.blogsInDb();

  expect(endBlogs).toHaveLength(helper.initialBlogs.length - 1);

  const titles = endBlogs.map(b => b.title);

  expect(titles).not.toContain(blogToRemove.title);
});

afterAll(() => {
  mongoose.connection.close();
})