import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

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
    const newBlog = await blogService.create(blogObject);
    dispatch(appendBlog(newBlog));
  };
};

export const updateItem = (id, blogObject) => {
  return async dispatch => {
    const likedBlog = await blogService.updateItem(id, blogObject);
    dispatch(updatedBlogs(likedBlog));
  };
};

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.deleteItem(id);
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;