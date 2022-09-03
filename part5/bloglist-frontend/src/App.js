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
  const [notification, setNotification] = useState(null);

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
      author: author || 'unknown author',
      url: url
    }

    try {
      const result = await blogService.create(blogObject)
      setBlogs(blogs.concat(result));
      setNotification({message: `a new blog ${blogObject.title} by ${blogObject.author} added`, status: 'ok'})
      setTimeout(()=>{
        setNotification(null);
      }, 5000)
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch {
      setNotification({message: 'error adding new blog: missing title or url', status: 'error'})
      setTimeout(()=>{
        setNotification(null);
      }, 5000)
    }
    
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
    } catch {
      setNotification({ message: 'wrong username or password', status: 'error' });
      setTimeout(()=>{
        setNotification(null)
      }, 5000);
    }
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
      <h2>login to the application</h2>
      { notification && handleNotification() }
      <div>
        username
        <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
    )
  }

  const userLoggedIn = () => {
    return <div><p>{user.name} logged-in<button onClick={handleLogout}>logout</button></p></div>
  }

  const handleNotification = () => {
    return (
      <div className={notification.status}>
        {notification.message}
      </div>
    )
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
      {notification && handleNotification()}
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
