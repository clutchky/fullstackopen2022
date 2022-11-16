import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    updatedBlogs(state, action) {
      const id = action.payload.id;
      state.map(blog => {
        blog.id !== id ? blog : action.payload;
      });
    }
  }
});

export const { appendBlog, setBlogs, updatedBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = blogObject => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject);
      dispatch(appendBlog(newBlog));
      dispatch(initializeBlogs());
      dispatch(setNotification({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        status: 'ok'
      }, 5));
    } catch {
      dispatch(setNotification({
        message: 'error adding new blog: missing title or url',
        status: 'error'
      }, 5));
    }
  };
};

export const updateItem = (id, blogObject) => {
  return async dispatch => {
    try {
      const likedBlog = await blogService.updateItem(id, blogObject);
      dispatch(updatedBlogs(likedBlog));
      dispatch(initializeBlogs());
      dispatch(setNotification({
        message: `You liked "${blogObject.title}" by ${blogObject.author}`,
        status: 'ok'
      }, 5));
    } catch (error) {
      dispatch(setNotification({
        message: 'error updating likes',
        status: 'error'
      }, 5));
    }
  };
};

export const removeBlog = (id, blog) => {
  return async dispatch => {
    try {
      await blogService.deleteItem(id);
      dispatch(initializeBlogs());
      dispatch(setNotification({
        message: `"${blog.title}" by ${blog.author} was removed`,
        status: 'ok'
      }, 5));
    } catch {
      dispatch(setNotification({
        message: 'error removing blog',
        status: 'error'
      }, 5));
    }
  };
};

export default blogSlice.reducer;