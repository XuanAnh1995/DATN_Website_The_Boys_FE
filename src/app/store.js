import { configureStore } from "@reduxjs/toolkit";
import { setUser, logOutUser } from "../features/common/UserSlice";
const ConbinedReducer = {
  // auth: authReducer,
  // products: productReducer,
  setUser: setUser,
  logOutUser: logOutUser,
};

export default configureStore({
  reducer: ConbinedReducer,
});
