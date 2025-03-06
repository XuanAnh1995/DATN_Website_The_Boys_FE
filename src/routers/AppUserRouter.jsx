import { Routes, Route } from "react-router-dom";
import UserMain from "../layout/UserLayout/UserMain"; // Sử dụng UserMain thay vì UserLayout

const AppUserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserMain />}></Route>
    </Routes>
  );
};

export default AppUserRouter;
