import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]);
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

  const addBlog = async blogObject => {

    try {
      blogFormRef.current.toggleVisibility();
      const result = await blogService.create(blogObject)
      setBlogs(blogs.concat(result));
      setNotification({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`, 
        status: 'ok'})
      setTimeout(()=>{
        setNotification(null);
      }, 5000)
    } catch {
      setNotification({message: 'error adding new blog: missing title or url', status: 'error'})
      setTimeout(()=>{
        setNotification(null);
      }, 5000)
    }
  }

  const updateLike = async (id, blogObj) => {
    
    try {
      await blogService.updateItem(id, blogObj);
      setNotification({
        message: `You liked "${blogObj.title}" by ${blogObj.author}`, 
        status: 'ok'})
      setTimeout(()=>{
        setNotification(null);
      }, 5000)
    } catch {
      setNotification({message: 'error updating likes', status: 'error'})
      setTimeout(()=>{
        setNotification(null);
      }, 5000)
    }

    setBlogs(await blogService.getAll());
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

  const blogFormRef = useRef();

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
      
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>


      {blogs
        .sort((a,b) => { return a.likes - b.likes })
        .map((blog, index) =>
          <Blog key={index} blog={blog} updateLike={updateLike} likes={blog.likes}/>
        )
        .reverse()
      }

    </div>
  )
}

export default App