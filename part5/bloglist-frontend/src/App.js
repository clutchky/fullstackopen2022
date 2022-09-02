import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const blogs = async () => {
	    setBlogs(await blogService.getAll())
    };

    blogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async event => {
    event.preventDefault();

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    const result = await blogService.create(blogObject)
    setBlogs(blogs.concat(result));
    setTitle('');
    setAuthor('');
    setUrl('');
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.error(exception);
    }

    console.log('logging in with', username, password);
  }

  const handleLogout = () => {
    window.localStorage.clear();

    setUser(null);
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  }
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
      <h3>login to the application</h3>
      <div>
        username
        <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="text" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
    )
  }

  const userLoggedIn = () => {
    return <div><p>{user.name} logged-in<button onClick={handleLogout}>logout</button></p></div>
  }

  if (user === null) {
    return (
      <div>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {user && userLoggedIn()}
      
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
        <label>title</label>
        <input value={title} onChange={handleTitleChange} />
        </div>
        <div>
        <label>author</label>
        <input value={author} onChange={handleAuthorChange} />
        </div>
        <div>
        <label>url</label>
        <input value={url} onChange={handleUrlChange} />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
