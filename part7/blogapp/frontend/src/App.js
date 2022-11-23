import { useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import Notification from './components/Notification';
import { initializeBlogs, createBlog, updateItem, removeBlog } from './reducers/blogReducer';
import { loggedUser, loginUser, logoutUser } from './reducers/userReducer';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { getUsers } from './reducers/usersReducer';

const SingleBlog = ({ updateLike }) => {

  const id = useParams().id;
  const dispatch = useDispatch();
  const blogs = useSelector(({ blogs }) => blogs);

  const blog = blogs.find(b => b.id === id);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const handleLike = async () => {
    await updateLike(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
  };

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><a href={`//${blog.url}`}>{blog.url}</a></div>
      <div>{blog.likes} likes <button onClick={handleLike}>like</button></div>
      <p>added by {blog.user.name}</p>
    </div>
  );
};

const Bloglist = () => {

  const blogs = useSelector(({ blogs }) => blogs);

  const sortedBlogs = [...blogs].sort((a, b) => {
    return a.likes - b.likes;
  });

  return (
    <div>
      {sortedBlogs
        .map((blog, index) => (
          <Blog key={index} blog={blog}>
            <SingleBlog />
          </Blog>
        ))
        .reverse()}
    </div>
  );

};

const Users = () => {

  const dispatch = useDispatch();
  const users = useSelector(({ users }) => users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td><strong>blogs created</strong></td>
          </tr>
          {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const User = () => {

  const id = useParams().id;

  const dispatch = useDispatch();
  const users = useSelector(({ users }) => users);

  const user = users.find(u => u.id === id);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <div>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>{blog.title}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const App = () => {

  const dispatch = useDispatch();
  const user = useSelector(({ userState }) => userState);

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
          {user.name} logged-in
        </p>
        <button onClick={handleLogout}>logout</button>
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

      <Router>

        <Routes>
          <Route path="/blogs/:id" element={<SingleBlog
            updateLike={updateLike}
            handleRemove={deleteBlog} />}
          />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Bloglist />} />
        </Routes>

      </Router>

    </div>
  );
};

export default App;