import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import BlogDetails from './components/BlogDetails';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { useDispatch } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  let notification;

  useEffect(() => {
    const blogs = async () => {
      setBlogs(await blogService.getAll());
    };

    blogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const result = await blogService.create(blogObject);
      notification = {
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        status: 'ok'
      };
      setBlogs(blogs.concat(result));
      dispatch(setNotification(notification, 5));
    } catch {
      notification = {
        message: 'error adding new blog: missing title or url',
        status: 'error'
      };
      dispatch(setNotification(notification, 5));
    }
    setBlogs(await blogService.getAll());
  };

  const updateLike = async (id, blogObj) => {
    try {
      await blogService.updateItem(id, blogObj);
      notification = {
        message: `You liked "${blogObj.title}" by ${blogObj.author}`,
        status: 'ok'
      };
      dispatch(setNotification(notification, 5));
    } catch {
      notification = {
        message: 'error updating likes',
        status: 'error'
      };
      dispatch(setNotification(notification, 5));
    }

    setBlogs(await blogService.getAll());
  };

  const deleteBlog = async (id, blog) => {
    if (window.confirm(`remove "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.deleteItem(id);
        notification = {
          message: `"${blog.title}" by ${blog.author} was removed`,
          status: 'ok'
        };
        dispatch(setNotification(notification, 5));
      } catch {
        notification = {
          message: 'error removing blog',
          status: 'error'
        };
        dispatch(setNotification(notification, 5));
      }

      setBlogs(await blogService.getAll());
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch {
      notification = {
        message: 'wrong username or password',
        status: 'error',
      };
      dispatch(setNotification(notification, 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();

    setUser(null);
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <h2>login to the application</h2>
        <Notification />
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            id="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            id="password"
          />
        </div>
        <button type="submit" id="login-btn">
          login
        </button>
      </form>
    );
  };

  const userLoggedIn = () => {
    return (
      <div>
        <p>
          {user.name} logged-in<button onClick={handleLogout}>logout</button>
        </p>
      </div>
    );
  };

  const blogFormRef = useRef();

  if (user === null) {
    return <div>{loginForm()}</div>;
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user && userLoggedIn()}

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => {
          return a.likes - b.likes;
        })
        .map((blog, index) => (
          <Blog key={index} blog={blog}>
            <BlogDetails
              blog={blog}
              updateLike={updateLike}
              likes={blog.likes}
              handleRemove={deleteBlog}
              owner={user}
            />
          </Blog>
        ))
        .reverse()}
    </div>
  );
};

export default App;
