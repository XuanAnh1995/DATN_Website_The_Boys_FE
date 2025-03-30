import { createSlice } from "@reduxjs/toolkit";

// ✅ Lấy state từ LocalStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("user");
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (error) {
    console.error("Lỗi khi lấy user từ LocalStorage", error);
    return null;
  }
};

// ✅ Lưu state vào LocalStorage
const saveState = (state) => {
  try {
    localStorage.setItem("user", JSON.stringify(state));
  } catch (error) {
    console.error("Lỗi khi lưu user vào LocalStorage", error);
  }
};

// ✅ Khởi tạo từ LocalStorage nếu có
const initialState = loadState() || {
  name: "",
  email: "",
  role: "",
  token: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      saveState(state); // 🔥 Lưu vào LocalStorage
    },
    logout(state) {
      state.name = "";
      state.email = "";
      state.role = "";
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user"); // 🔥 Xóa khỏi LocalStorage
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
