import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/user';

const usersSlice = createSlice({
  name: 'usersList',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    }
  }
});

export const { setUsers } = usersSlice.actions;

export const getUsers = () => {
  return async dispatch => {
    const response = await userService.getUsers();
    dispatch(setUsers(response));
  };
};

export default usersSlice.reducer;