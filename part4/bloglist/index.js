require('dotenv').config();
const express = require('express');

const Blog = require('./models/blog');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

const Blog = new mongoose.model('Blog', blogSchema);

const app = express();

let blogs = [
  {
    id: 1,
    title: "Alive in Retrospect",
    author: "Izza Montederamos",
    url: "http://aliveinretrospect.com",
    likes: 213
  },
  {
    id: 2,
    title: "Nintendo Budget Gamer",
    author: "Jam Amoroso",
    url: "http://nintendobudgetgamer.com",
    likes: 123
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Blog List</h1>');
});

app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
})

app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then(blog => {
      response.json(blog);
    })
});

app.delete('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id);
  blog = blogs.filter(blog => blog.id !== id);

  response.status(204).end();
});

app.post('/api/blogs', (request, response) => {
  const body = request.body

  if (!body.title === undefined) {
    return response.status(400).json({
      error: "title missing"
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
