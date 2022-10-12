import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterAnecdote(state, action) {
      const filteredValue = action.payload;
      return filteredValue
    }
  }
});

export const { filterAnecdote } = filterSlice.actions;
export default filterSlice.reducer;