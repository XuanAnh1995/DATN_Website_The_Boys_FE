import { Routes, Route } from "react-router-dom";
import UserMain from "../layout/UserLayout/UserMain";
import ViewProductDetail from "../pages/Users/ViewProductDetail";

const AppUserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserMain />}>
        <Route path="san-pham/:id" element={<ViewProductDetail />} />
      </Route>
    </Routes>
  );
};

export default AppUserRouter;
