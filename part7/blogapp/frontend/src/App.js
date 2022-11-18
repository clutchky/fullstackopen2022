import { useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import BlogDetails from './components/BlogDetails';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import Notification from './components/Notification';
import { initializeBlogs, createBlog, updateItem, removeBlog } from './reducers/blogReducer';
import { loggedUser, loginUser, logoutUser } from './reducers/userReducer';

const App = () => {

  const dispatch = useDispatch();
  const blogs = useSelector(({ blogs }) => blogs);
  const user = useSelector(({ userState }) => userState);

  const sortedBlogs = [...blogs].sort((a, b) => {
    return a.likes - b.likes;
  });

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loggedUser());
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
  };

  const updateLike = async (id, blogObj) => {
    dispatch(updateItem(id, blogObj));
  };

  const deleteBlog = async (id, blog) => {
    if (window.confirm(`remove "${blog.title}" by ${blog.author}?`)) {
      dispatch(removeBlog(id, blog));
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    event.target.username.value = '';
    const password = event.target.password.value;
    event.target.password.value = '';

    dispatch(loginUser({ username, password }));

  };

  const handleLogout = () => {
    dispatch(logoutUser());
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
            name="username"
            id="username"
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="password"
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
        <BlogForm createBlog={addBlog} owner={user}/>
      </Togglable>

      {sortedBlogs
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