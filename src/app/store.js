import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice'; // Import userSlice reducer

const store = configureStore({
  reducer: {
    user: userReducer, // Thêm user reducer
  },
});

export default store;