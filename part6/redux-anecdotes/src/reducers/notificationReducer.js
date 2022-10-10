import { createSlice } from "@reduxjs/toolkit";

const initialState = 'This is a notification';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducer: initialState
})

export default notificationSlice.reducer;