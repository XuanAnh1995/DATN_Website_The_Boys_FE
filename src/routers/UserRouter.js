import { Routes, Route } from "react-router-dom";
import UserMain from "../UserLayout/UserMain";
import HomePage from "../pages/Home"; // Trang chủ
import AboutPage from "../pages/About"; // Trang giới thiệu

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserMain />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
};

export default UserRouter;
