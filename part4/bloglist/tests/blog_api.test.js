const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../tests/test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

describe('when blogs are initialized', () => {
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

  describe('adding a blog', () => {
    test('succeeds with valid data', async () => {
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
  });
  
  describe('updating a blog', () => {
    test('update the amount of likes', async () => {
      const startingBlogs = await helper.blogsInDb();
      const blogToUpdate = startingBlogs[0];
    
      const newBlogUpdate = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      };
    
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlogUpdate)
        .expect(200)
    
      const endBlogs = await helper.blogsInDb();
    
      expect(endBlogs).toHaveLength(helper.initialBlogs.length);
    
      const likes = endBlogs.map(b => b.likes);
      
      expect(likes).toContain(newBlogUpdate.likes);
    });
  })
  
  describe('deleting a blog', () => {
    test('a blog can be deleted', async () => {
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
  });
});

// User tests
describe('initialize database with one user', () => {
  beforeEach( async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({
      username: 'root',
      passwordHash
    });

    await user.save();
  });

  test('database has one user', async () => {
    const users = await User.find({});

    expect(users).toHaveLength(1);
  })

  // test that invalid users are not created and invalid add user operation 
  // returns a suitable status code and error message
  test('creation fails with proper status code and message if username and password are undefined', async () => {
    const usersAtStart = await helper.usersInDb();
    
    const newUser = await helper.emptyUser();

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username and password required');  
    
    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper status code and message if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb();
    
    const newUser = {
      username: 'root',
      password: 'superuser',
      name: 'Root'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');  
    
    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper status code and message if username has invalid length', async () => {
    const usersAtStart = await helper.usersInDb();
    
    const newUser = {
      username: 'jd',
      password: 'secret',
      name: 'Juan dela Cruz'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('User validation failed: username: must be at least 3 characters or more');  
    
    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper status code and message if password has invalid length', async () => {
    const usersAtStart = await helper.usersInDb();
    
    const newUser = {
      username: 'jdcruz',
      password: 'wa',
      name: 'Juan dela Cruz'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password must be at least 3 characters or more');  
    
    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toEqual(usersAtStart);
  });

});

afterAll(() => {
  mongoose.connection.close();
})