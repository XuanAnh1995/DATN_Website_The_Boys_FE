import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  role: '', // Thêm trường role
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role; // Lưu vai trò người dùng
      state.isLoggedIn = true;
    },
    logout(state) {
      state.name = '';
      state.email = '';
      state.role = ''; // Xóa vai trò khi đăng xuất
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;