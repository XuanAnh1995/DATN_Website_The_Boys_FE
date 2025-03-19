import { createSlice } from "@reduxjs/toolkit";
import AuthService from "../services/AuthService";

const initialState = {
  name: "",
  email: "",
  role: AuthService.getRole() || "",  // Lấy role từ AuthService
  token: AuthService.getToken() || "", // Lấy token từ AuthService
  isLoggedIn: !!AuthService.getToken(), // Kiểm tra có token không
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
    },
    logout(state) {
      state.name = "";
      state.email = "";
      state.role = "";
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
