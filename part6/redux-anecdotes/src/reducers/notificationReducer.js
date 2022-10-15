import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      const notification = action.payload;
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
    setTimeout(() => {
      dispatch(removeNotification());
    }, duration * 1000);

  }
}
export default notificationSlice.reducer;