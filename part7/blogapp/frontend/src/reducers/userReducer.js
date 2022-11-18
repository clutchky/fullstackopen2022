import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import loginService from '../services/login';
import { setNotification } from './notificationReducer';

const userSlice = createSlice({
  name: 'userState',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;

export const loggedUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  };
};

export const loginUser = (userObject) => {
  return async dispatch => {
    try {
      const user = await loginService.login(userObject);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
    } catch {
      dispatch(setNotification({
        message: 'wrong username or password',
        status: 'error',
      }, 5));
    }
  };
};

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.clear();
    dispatch(setUser(null));
  };
};

export default userSlice.reducer;