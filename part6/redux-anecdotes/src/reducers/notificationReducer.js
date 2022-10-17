import { createSlice } from "@reduxjs/toolkit";

let timeoutID;

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      const notification = action.payload;
      if (notification) {
        clearTimeout(timeoutID);
      }
      return notification;
    },
    removeNotification() {
      return null
    }
  }
})

export const { createNotification, removeNotification } = notificationSlice.actions;
export const setNotification = (notification, duration) => {
  return async dispatch => {
      dispatch(createNotification(notification))
      timeoutID = setTimeout(() => {
        dispatch(removeNotification());
      }, duration * 1000);
  }
}
export default notificationSlice.reducer;