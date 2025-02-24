import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  role: "guest",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logOutUser(state) {
      state.token = null;
      state.role = "guest";
    },
  },
});
export const { setUser, logOutUser } = userSlice.actions;
export default userSlice.reducer;
