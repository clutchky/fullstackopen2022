import { useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import Notification from './components/Notification';
import { initializeBlogs, createBlog, updateItem, removeBlog, addNewComment } from './reducers/blogReducer';
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
  }, [dispatch]);

  const handleLike = async () => {
    await updateLike(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
  };

  const addComment = async (event) => {
    event.preventDefault();

    const comment = event.target.comment.value;
    event.target.comment.value = '';

    const commentObj = {
      content: comment
    };

    dispatch(addNewComment(id, commentObj));
    dispatch(initializeBlogs());
  };


  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><Link to={`//${blog.url}`}>{blog.url}</Link></div>
      <div>{blog.likes} likes <button onClick={handleLike}>like</button></div>
      <p>added by {blog.user.name}</p>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <div>
          <input
            id="blog-comment"
            name="comment"
          />
          <button type="submit" id="createComment-btn">
            add comment
          </button>
        </div>
      </form>
      <ul>
        {blog.comments.map((c, index) => (
          <li key={index}>{c.content}</li>
        ))}
      </ul>
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

  const padding = {
    padding: 5
  };

  const navStyle = {
    height: 'auto',
    backgroundColor: 'teal',
    padding: 5
  };

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

  const blogFormRef = useRef();

  if (user === null) {
    return <div>{loginForm()}</div>;
  }

  return (
    <div>

      <Router>

        <div style={navStyle}>
          <Link to="/" style={padding}>blogs</Link>
          <Link to="/users" style={padding}>users</Link>
          {user
            ? <span>{user.name} logged-in <button onClick={handleLogout}>logout</button></span>
            : <Link to="/login" style={padding}>login</Link>
          }
        </div>

        <h2>blog app</h2>
        <Notification />

        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} owner={user}/>
        </Togglable>

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