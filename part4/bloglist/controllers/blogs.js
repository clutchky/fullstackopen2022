const { userExtractor } = require('../utils/middleware');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 });

  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else { // else block is triggered when there is no matching object
    response.status(404).end();
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {  
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  
  await user.save();

  response.status(201).json(savedBlog);

})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  
  const user = request.user;

  const blogToDelete = await Blog.findById(request.params.id);

  if (user._id.toString() === blogToDelete.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id);

    response.status(204).end();
  } else {
    return response.status(401).json({
      error: 'cannot delete blog of other users'
    })
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }, { new: true }
  );

  await response.json(updatedBlog);
})

module.exports = blogsRouter;